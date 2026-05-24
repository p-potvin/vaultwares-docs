import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsDir = path.join(__dirname, 'docs-content')

const args = new Set(process.argv.slice(2))
const confirmed = args.has('--yes')
const dryRun = args.has('--dry-run')
const onlyExactQc = args.has('--only-exact-qc')
const onlyCleanQc = args.has('--only-clean-qc')
const model = process.env.OLLAMA_MODEL || 'gemma4'
const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
const delayMs = Number.parseInt(process.env.TRANSLATE_DELAY_MS || '2000', 10)
const limit = Number.parseInt(process.env.TRANSLATE_LIMIT || '0', 10)

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function walkDir(dir) {
  let results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results = results.concat(walkDir(filePath))
    } else if (filePath.endsWith('.mdx') && !filePath.endsWith('-QC.mdx')) {
      results.push(filePath)
    }
  }
  return results.sort((a, b) => a.localeCompare(b))
}

function splitFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { frontmatter: '', body: normalized }
  return { frontmatter: match[1], body: normalized.slice(match[0].length) }
}

function normalizeForCompare(content) {
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

function hasExactQcCopy(filePath) {
  const qcPath = filePath.replace(/\.mdx$/, '-QC.mdx')
  if (!fs.existsSync(qcPath)) return false
  return normalizeForCompare(fs.readFileSync(filePath, 'utf8')) === normalizeForCompare(fs.readFileSync(qcPath, 'utf8'))
}

function getLocallyChangedFiles() {
  const output = execSync('git diff --name-only -- docs-content', {
    cwd: __dirname,
    encoding: 'utf8',
  })
  return new Set(output.split(/\r?\n/).filter(Boolean).map((entry) => path.resolve(__dirname, entry)))
}

function protectCodeFences(content) {
  const blocks = []
  const protectedContent = content.replace(/^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n[ \t]*\1[ \t]*$/gm, (match) => {
    const token = `%%VW_CODE_BLOCK_${blocks.length}%%`
    blocks.push(match)
    return token
  })
  return { protectedContent, blocks }
}

function restoreCodeFences(content, blocks) {
  return blocks.reduce((next, block, index) => next.replace(`%%VW_CODE_BLOCK_${index}%%`, block), content)
}

function stripModelWrapper(content) {
  const trimmed = content.trim()
  const fenced = trimmed.match(/^```(?:mdx|markdown|md)?\n([\s\S]*?)\n```$/i)
  return fenced ? fenced[1].trim() : trimmed
}

async function translateWithOllama(text) {
  const prompt = [
    'Translate this complete MDX documentation file from English to Quebec French for a public VaultWares documentation website.',
    'Return the complete translated MDX file only.',
    'Rules:',
    '- Preserve Markdown structure, heading levels, tables, lists, admonitions, and MDX component tag names.',
    '- Preserve JSX attribute names, URLs, routes, imports, exports, file paths, command names, environment variable names, and product names.',
    '- Translate user-facing prose, frontmatter title and description values, headings, link text, list text, table prose, and user-visible JSX attribute values such as title, description, label, and children.',
    '- Leave %%VW_CODE_BLOCK_N%% placeholders exactly unchanged.',
    '- Use natural Quebec French, not literal France French.',
    '- Do not add explanations. Do not wrap the answer in a code fence.',
    '',
    text,
  ].join('\n')

  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { temperature: 0.1 },
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama returned HTTP ${response.status}`)
  }

  const payload = await response.json()
  return stripModelWrapper(String(payload.response || text))
}

async function translateFile(filePath) {
  const qcPath = filePath.replace(/\.mdx$/, '-QC.mdx')
  const source = fs.readFileSync(filePath, 'utf8')
  const { protectedContent, blocks } = protectCodeFences(source)
  const translated = restoreCodeFences(await translateWithOllama(protectedContent), blocks)
  const sourceFrontmatter = splitFrontmatter(source)
  let normalized = `${translated.trim()}\n`

  if (sourceFrontmatter.frontmatter && !normalized.startsWith('---\n') && normalized.includes('\n---\n')) {
    normalized = `---\n${normalized}`
  }

  let translatedFrontmatter = splitFrontmatter(normalized)

  if (sourceFrontmatter.frontmatter && !translatedFrontmatter.frontmatter) {
    const lines = normalized.split('\n')
    const yamlLines = []
    let bodyStart = 0

    for (const line of lines) {
      if (!line.trim()) {
        bodyStart += 1
        break
      }
      if (!/^[A-Za-z0-9_-]+:\s*/.test(line)) {
        break
      }
      yamlLines.push(line)
      bodyStart += 1
    }

    if (yamlLines.length > 0) {
      normalized = `---\n${yamlLines.join('\n')}\n---\n\n${lines.slice(bodyStart).join('\n').trim()}\n`
      translatedFrontmatter = splitFrontmatter(normalized)
    }
  }

  if (sourceFrontmatter.frontmatter && !translatedFrontmatter.frontmatter) {
    const failureDir = path.join(__dirname, '.omx', 'translation-failures')
    fs.mkdirSync(failureDir, { recursive: true })
    fs.writeFileSync(
      path.join(failureDir, `${path.relative(docsDir, filePath).replace(/[\\/]/g, '__')}.txt`),
      normalized,
      'utf8'
    )
    throw new Error(`Translation dropped frontmatter: ${path.relative(docsDir, filePath)}`)
  }

  if (!dryRun) {
    fs.writeFileSync(qcPath, normalized, 'utf8')
  }
}

async function main() {
  const files = walkDir(docsDir)
  const changedFiles = onlyCleanQc ? getLocallyChangedFiles() : new Set()
  const candidates = files.filter((file) => {
    if (onlyExactQc && !hasExactQcCopy(file)) return false
    if (onlyCleanQc && changedFiles.has(path.resolve(file.replace(/\.mdx$/, '-QC.mdx')))) return false
    return true
  })
  const selected = limit > 0 ? candidates.slice(0, limit) : candidates
  const estimatedRequests = selected.length

  console.log(`Target: ${ollamaUrl}/api/generate`)
  console.log(`Model: ${model}`)
  console.log(`Only exact QC copies: ${onlyExactQc}`)
  console.log(`Only QC files without local changes: ${onlyCleanQc}`)
  console.log(`Files: ${selected.length}`)
  console.log(`Estimated requests: ${estimatedRequests}`)
  console.log(`Delay: ${delayMs}ms`)

  if (!confirmed) {
    console.log('Refusing to run request loop without --yes. Ask the user before using --yes.')
    process.exitCode = 2
    return
  }

  for (const [index, file] of selected.entries()) {
    console.log(`[${index + 1}/${selected.length}] ${path.relative(docsDir, file)}`)
    await translateFile(file)
    await sleep(delayMs)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
