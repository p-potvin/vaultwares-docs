export interface FrontmatterData {
  title?: string
  description?: string
}

export function stripTopLevelEsm(input: string): string {
  return input
    .split('\n')
    .filter((line) => !line.trim().startsWith('import ') && !line.trim().startsWith('export '))
    .join('\n')
}

function applyReplacementsOutsideCodeBlocks(input: string, replacer: (segment: string) => string): string {
  const chunks = input.split(/(```[\s\S]*?```)/g)
  return chunks
    .map((chunk, index) => (index % 2 === 1 ? chunk : replacer(chunk)))
    .join('')
}

export function parseFrontmatter(raw: string): { body: string; data: FrontmatterData } {
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  if (!normalized.startsWith('---\n')) {
    return { body: normalized, data: {} }
  }

  const endIndex = normalized.indexOf('\n---\n', 4)
  if (endIndex === -1) {
    return { body: normalized, data: {} }
  }

  const frontmatterBlock = normalized.slice(4, endIndex).trim()
  const data: FrontmatterData = {}

  for (const line of frontmatterBlock.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const splitAt = trimmed.indexOf(':')
    if (splitAt === -1) continue

    const key = trimmed.slice(0, splitAt).trim()
    const value = trimmed
      .slice(splitAt + 1)
      .trim()
      .replace(/^['"]/, '')
      .replace(/['"]$/, '')

    if (key === 'title') data.title = value
    if (key === 'description') data.description = value
  }

  const body = normalized.slice(endIndex + '\n---\n'.length)
  return { body, data }
}

export function prepareMdxSource(rawBody: string): string {
  const normalized = rawBody.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  return applyReplacementsOutsideCodeBlocks(normalized, (segment) => {
    return segment
      .replace(/<=/g, '&lt;=')
      .replace(/<repo>/g, '&lt;repo&gt;')
      .replace(/^(\s*-\s*[A-Za-z0-9_-]+:)\{([^}]+)\}/gm, '$1&#123;$2&#125;')
  })
}

export function normalizeMdxForMarkdown(rawBody: string): string {
  const prepared = stripTopLevelEsm(prepareMdxSource(rawBody))
  return applyReplacementsOutsideCodeBlocks(prepared, (segment) =>
    segment
      .replace(/<(\/?)([A-Z][A-Za-z0-9]*)\b/g, (_, slash, tagName: string) => `<${slash}${tagName.toLowerCase()}`)
      .replace(/(\w+)=\{['"]([^'"]+)['"]\}/g, '$1="$2"')
      .replace(/(\w+)=\{([0-9]+)\}/g, '$1="$2"')
      .replace(/(\w+)=\{(true|false)\}/g, '$1="$2"')
  )
}

export function formatRouteLabel(routePath: string): string {
  if (routePath === '/') return 'Home'
  const slug = routePath.replace(/^\//, '').split('/').pop() || routePath
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ')
}
