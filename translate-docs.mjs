import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsDir = path.join(__dirname, 'docs-content')

const args = new Set(process.argv.slice(2))
const confirmed = args.has('--yes')
const dryRun = args.has('--dry-run')
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

function splitTranslatableBlocks(body) {
  const blocks = []
  let current = []
  let inCodeFence = false

  for (const line of body.split('\n')) {
    if (line.trim().startsWith('```')) {
      if (current.length) blocks.push({ type: 'text', value: current.join('\n') })
      current = []
      inCodeFence = !inCodeFence
      blocks.push({ type: 'raw', value: line })
      continue
    }

    if (inCodeFence || line.trim() === '' || line.trim().startsWith('import ') || line.trim().startsWith('export ')) {
      if (current.length) blocks.push({ type: 'text', value: current.join('\n') })
      current = []
      blocks.push({ type: 'raw', value: line })
      continue
    }

    current.push(line)
  }

  if (current.length) blocks.push({ type: 'text', value: current.join('\n') })
  return blocks
}

async function translateWithOllama(text) {
  const prompt = [
    'Translate this MDX documentation block to Quebec French.',
    'Preserve Markdown, MDX tags, JSX attribute names, code spans, links, URLs, product names, and file paths.',
    'Return only the translated block.',
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
  return String(payload.response || text).trim()
}

async function translateFile(filePath) {
  const qcPath = filePath.replace(/\.mdx$/, '-QC.mdx')
  const source = fs.readFileSync(filePath, 'utf8')
  const { frontmatter, body } = splitFrontmatter(source)
  const blocks = splitTranslatableBlocks(body)
  const translatedBlocks = []

  for (const block of blocks) {
    if (block.type === 'raw' || !/[A-Za-z]/.test(block.value)) {
      translatedBlocks.push(block.value)
      continue
    }
    translatedBlocks.push(await translateWithOllama(block.value))
    await sleep(delayMs)
  }

  const output = frontmatter
    ? `---\n${frontmatter}\n---\n\n${translatedBlocks.join('\n').trim()}\n`
    : `${translatedBlocks.join('\n').trim()}\n`

  if (!dryRun) {
    fs.writeFileSync(qcPath, output, 'utf8')
  }
}

async function main() {
  const files = walkDir(docsDir)
  const selected = limit > 0 ? files.slice(0, limit) : files
  const estimatedRequests = selected.length

  console.log(`Target: ${ollamaUrl}/api/generate`)
  console.log(`Model: ${model}`)
  console.log(`Files: ${selected.length}`)
  console.log(`Estimated minimum requests: ${estimatedRequests}`)
  console.log(`Delay: ${delayMs}ms`)

  if (!confirmed) {
    console.log('Refusing to run request loop without --yes. Ask the user before using --yes.')
    process.exitCode = 2
    return
  }

  for (const [index, file] of selected.entries()) {
    console.log(`[${index + 1}/${selected.length}] ${path.relative(docsDir, file)}`)
    await translateFile(file)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
