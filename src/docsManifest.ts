import { PAGE_RESOURCE_ENTRIES, type PageResourceEntry } from './resources/pageResourcesManifest'
import { SECTION_LABELS, type DocsLang } from './resources/uiResources'

export type { DocsLang } from './resources/uiResources'

export interface DocPageLocale {
  title: string
  description: string
  body: string
}

interface PageLocaleResource {
  EN: DocPageLocale
  QC: DocPageLocale | null
}

export interface DocPageEntry extends PageResourceEntry {}

const PAGE_RESOURCE_MODULES = import.meta.glob('./resources/pages/*.json', {
  import: 'default',
}) as Record<string, () => Promise<PageLocaleResource>>

const pageResourceCache = new Map<string, PageLocaleResource>()

export const DOC_PAGE_ENTRIES: DocPageEntry[] = [...PAGE_RESOURCE_ENTRIES].sort((a, b) =>
  a.routePath.localeCompare(b.routePath)
)

function toResourceModuleKey(resourceKey: string): string {
  return `./resources/pages/${resourceKey}.json`
}

export async function loadPageResource(entry: DocPageEntry): Promise<PageLocaleResource | undefined> {
  const cacheHit = pageResourceCache.get(entry.resourceKey)
  if (cacheHit) return cacheHit

  const moduleKey = toResourceModuleKey(entry.resourceKey)
  const loader = PAGE_RESOURCE_MODULES[moduleKey]
  if (!loader) {
    return undefined
  }

  const data = await loader()
  pageResourceCache.set(entry.resourceKey, data)
  return data
}

export async function loadPageLocale(entry: DocPageEntry, lang: DocsLang): Promise<DocPageLocale | undefined> {
  const data = await loadPageResource(entry)
  if (!data) return undefined
  if (lang === 'QC') return data.QC ?? data.EN
  return data.EN
}

export function getSectionLabel(sectionKey: string, lang: DocsLang): string {
  const normalized = sectionKey.toLowerCase()
  if (lang === 'QC') {
    return SECTION_LABELS.QC[normalized] || normalized
  }
  return SECTION_LABELS.EN[normalized] || normalized
}
