export type DocsLang = 'EN' | 'QC'

type RawMdxLoader = () => Promise<string>

const RAW_DOC_MODULES = import.meta.glob('../docs-content/**/*.mdx', {
  query: '?raw',
  import: 'default',
}) as Record<string, RawMdxLoader>

export interface DocPageEntry {
  routePath: string
  routeKey: string
  sectionKey: string
  enModuleKey?: string
  qcModuleKey?: string
}

function toRoutePath(relativePath: string): string {
  let noExt = relativePath.replace(/\.mdx$/i, '')
  if (noExt.endsWith('-QC')) {
    noExt = noExt.slice(0, -3)
  }
  if (noExt.endsWith('/index')) {
    noExt = noExt.slice(0, -'/index'.length)
  }
  if (noExt === 'index') {
    return '/'
  }
  return `/${noExt}`
}

function toRouteKey(routePath: string): string {
  if (routePath === '/') return 'index'
  return routePath.replace(/^\//, '')
}

function toSectionKey(routePath: string): string {
  if (routePath === '/') return 'root'
  return routePath.replace(/^\//, '').split('/')[0] || 'root'
}

function buildDocPageEntries(): DocPageEntry[] {
  const entriesByRoute = new Map<string, DocPageEntry>()

  for (const moduleKey of Object.keys(RAW_DOC_MODULES)) {
    const relativePath = moduleKey.replace(/^\.\.\/docs-content\//, '')
    const routePath = toRoutePath(relativePath)
    const existing = entriesByRoute.get(routePath)
    const next: DocPageEntry = existing
      ? { ...existing }
      : {
          routePath,
          routeKey: toRouteKey(routePath),
          sectionKey: toSectionKey(routePath),
        }

    if (relativePath.endsWith('-QC.mdx')) {
      next.qcModuleKey = moduleKey
    } else {
      next.enModuleKey = moduleKey
    }

    entriesByRoute.set(routePath, next)
  }

  return [...entriesByRoute.values()].sort((a, b) => a.routePath.localeCompare(b.routePath))
}

export const DOC_PAGE_ENTRIES = buildDocPageEntries()

const SECTION_LABELS_EN: Record<string, string> = {
  root: 'Overview',
  'getting-started': 'Getting Started',
  essentials: 'Essentials',
  hardware: 'Hardware',
  software: 'Software',
  installation: 'Installation',
  guides: 'Guides',
  operations: 'Operations',
  security: 'Security',
  compliance: 'Compliance',
  'api-reference': 'API Reference',
  support: 'Support',
  'ai-tools': 'AI Tools',
  branding: 'Branding',
}

const SECTION_LABELS_QC: Record<string, string> = {
  root: 'Aperçu',
  'getting-started': 'Commencer',
  essentials: 'Essentiels',
  hardware: 'Matériel',
  software: 'Logiciel',
  installation: 'Installation',
  guides: 'Guides',
  operations: 'Opérations',
  security: 'Sécurité',
  compliance: 'Conformité',
  'api-reference': 'Référence API',
  support: 'Assistance',
  'ai-tools': 'Outils IA',
  branding: 'Image de marque',
}

export function getSectionLabel(sectionKey: string, lang: DocsLang): string {
  const normalized = sectionKey.toLowerCase()
  if (lang === 'QC') {
    return SECTION_LABELS_QC[normalized] || normalized
  }
  return SECTION_LABELS_EN[normalized] || normalized
}

export function getPreferredModuleKey(entry: DocPageEntry, lang: DocsLang): string | undefined {
  if (lang === 'QC' && entry.qcModuleKey) {
    return entry.qcModuleKey
  }
  return entry.enModuleKey || entry.qcModuleKey
}

export function loadRawMdx(moduleKey: string): Promise<string> {
  const loader = RAW_DOC_MODULES[moduleKey]
  if (!loader) {
    return Promise.reject(new Error(`Missing MDX module key: ${moduleKey}`))
  }
  return loader()
}
