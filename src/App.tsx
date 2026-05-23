import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { DOC_PAGE_ENTRIES, getPreferredModuleKey, getSectionLabel, loadRawMdx, type DocPageEntry, type DocsLang } from './docsManifest'
import { markdownComponents } from './markdownComponents'
import { formatRouteLabel, normalizeMdxForMarkdown, parseFrontmatter } from './mdxUtils'
import './index.css'

const UI_TEXT = {
  EN: {
    docsTitle: 'VaultWares Docs',
    subtitle: 'Privacy first. Security in service.',
    pageMissingTitle: 'Page Missing',
    pageMissingBody: 'This page is not available in this build.',
    renderErrorTitle: 'Render Error',
    renderErrorBody: 'The document could not be rendered. Please check source formatting.',
    missingIndex: 'Missing docs index page',
  },
  QC: {
    docsTitle: 'Documentation VaultWares',
    subtitle: 'Confidentialité d’abord. Sécurité en service.',
    pageMissingTitle: 'Page introuvable',
    pageMissingBody: 'Cette page n’est pas disponible dans cette version.',
    renderErrorTitle: 'Erreur de rendu',
    renderErrorBody: 'Le document n’a pas pu être affiché. Vérifiez le format source.',
    missingIndex: 'Page index de la documentation introuvable',
  },
} as const

const SECTION_ORDER = [
  'root',
  'getting-started',
  'essentials',
  'hardware',
  'software',
  'installation',
  'guides',
  'operations',
  'security',
  'compliance',
  'api-reference',
  'support',
  'ai-tools',
  'branding',
] as const

function groupEntriesBySection(entries: DocPageEntry[]): Array<{ sectionKey: string; items: DocPageEntry[] }> {
  const groups = new Map<string, DocPageEntry[]>()
  for (const entry of entries) {
    if (!groups.has(entry.sectionKey)) {
      groups.set(entry.sectionKey, [])
    }
    groups.get(entry.sectionKey)!.push(entry)
  }

  for (const items of groups.values()) {
    items.sort((a, b) => a.routePath.localeCompare(b.routePath))
  }

  const ordered: Array<{ sectionKey: string; items: DocPageEntry[] }> = []
  for (const key of SECTION_ORDER) {
    const items = groups.get(key)
    if (items?.length) ordered.push({ sectionKey: key, items })
    groups.delete(key)
  }

  const fallback = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  for (const [sectionKey, items] of fallback) {
    ordered.push({ sectionKey, items })
  }

  return ordered
}

function DocPage({ entry, lang }: { entry: DocPageEntry; lang: DocsLang }) {
  const [content, setContent] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const ui = UI_TEXT[lang]

  useEffect(() => {
    let cancelled = false

    async function load() {
      const moduleKey = getPreferredModuleKey(entry, lang)
      if (!moduleKey) {
        if (!cancelled) {
          setTitle(ui.pageMissingTitle)
          setContent(ui.pageMissingBody)
        }
        return
      }

      try {
        const raw = await loadRawMdx(moduleKey)
        const { body, data } = parseFrontmatter(raw)
        if (!cancelled) {
          const computedTitle = data.title || formatRouteLabel(entry.routePath)
          setTitle(computedTitle)
          setContent(normalizeMdxForMarkdown(body))
          document.title = `${computedTitle} | ${ui.docsTitle}`
        }
      } catch {
        if (!cancelled) {
          setTitle(ui.renderErrorTitle)
          setContent(ui.renderErrorBody)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [entry, lang, ui.docsTitle, ui.pageMissingBody, ui.pageMissingTitle, ui.renderErrorBody, ui.renderErrorTitle])

  return (
    <article className="prose prose-vw max-w-none">
      <h1>{title || formatRouteLabel(entry.routePath)}</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={markdownComponents as unknown as Components}
      >
        {content}
      </ReactMarkdown>
    </article>
  )
}

function AppLayout() {
  const [lang, setLang] = useState<DocsLang>('QC')
  const ui = UI_TEXT[lang]
  const navGroups = useMemo(() => groupEntriesBySection(DOC_PAGE_ENTRIES), [])
  const homeEntry = DOC_PAGE_ENTRIES.find((entry) => entry.routePath === '/')

  return (
    <div className="min-h-screen bg-vw-console-bg text-white">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-vw-console-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/vaultwares-minimal-gold-filled.png" alt="VaultWares" className="h-8 w-8" />
            <div>
              <div className="font-mono text-sm uppercase tracking-wide text-vw-console-gold">{ui.docsTitle}</div>
              <div className="text-xs text-violet-100/60">{ui.subtitle}</div>
            </div>
          </Link>

          <button
            onClick={() => setLang((prev) => (prev === 'EN' ? 'QC' : 'EN'))}
            className="rounded-xl border border-white/10 bg-vw-console-raised px-3 py-1.5 font-mono text-xs text-violet-100/80 hover:text-white"
          >
            {lang}
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="hidden h-[calc(100vh-57px)] w-80 overflow-y-auto border-r border-white/5 px-3 py-5 lg:block">
          {navGroups.map((group) => (
            <section key={group.sectionKey} className="mb-6">
              <h2 className="mb-2 px-3 font-mono text-[11px] uppercase tracking-widest text-violet-100/45">
                {getSectionLabel(group.sectionKey, lang)}
              </h2>
              <div className="space-y-1">
                {group.items.map((entry) => (
                  <NavLink
                    key={entry.routePath}
                    to={entry.routePath}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-vw-console-raised text-vw-console-gold'
                          : 'text-violet-100/65 hover:bg-vw-console-raised/70 hover:text-white'
                      }`
                    }
                    end={entry.routePath === '/'}
                  >
                    {formatRouteLabel(entry.routePath)}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <Routes>
            {homeEntry ? <Route path="/" element={<DocPage entry={homeEntry} lang={lang} />} /> : null}
            {DOC_PAGE_ENTRIES.filter((entry) => entry.routePath !== '/').map((entry) => (
              <Route key={entry.routeKey} path={entry.routePath} element={<DocPage entry={entry} lang={lang} />} />
            ))}
            {homeEntry ? <Route path="*" element={<Navigate to="/" replace />} /> : <Route path="*" element={<div>{ui.missingIndex}</div>} />}
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
