import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import {
  DOC_PAGE_ENTRIES,
  getSectionLabel,
  loadPageLocale,
  type DocPageEntry,
  type DocsLang,
} from './docsManifest'
import { MdxDocument } from './MdxDocument'
import { formatRouteLabel, prepareMdxSource } from './mdxUtils'
import { SECTION_ORDER, UI_TEXT } from './resources/uiResources'
import { Led } from './revisited/Led'
import { Shell } from './revisited/Shell'
import './index.css'

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
      try {
        const page = await loadPageLocale(entry, lang)
        if (!page) {
          if (!cancelled) {
            setTitle(ui.pageMissingTitle)
            setContent(ui.pageMissingBody)
          }
          return
        }

        if (!cancelled) {
          const computedTitle = page.title || formatRouteLabel(entry.routePath)
          setTitle(computedTitle)
          setContent(prepareMdxSource(page.body))
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
      <MdxDocument source={content} />
    </article>
  )
}

function NavItemLabel({ entry, lang }: { entry: DocPageEntry; lang: DocsLang }) {
  const [label, setLabel] = useState(formatRouteLabel(entry.routePath))

  useEffect(() => {
    let cancelled = false

    async function loadLabel() {
      try {
        const page = await loadPageLocale(entry, lang)
        if (!cancelled) {
          setLabel(page?.title || formatRouteLabel(entry.routePath))
        }
      } catch {
        if (!cancelled) {
          setLabel(formatRouteLabel(entry.routePath))
        }
      }
    }

    loadLabel()

    return () => {
      cancelled = true
    }
  }, [entry, lang])

  return <>{label}</>
}

function AppLayout() {
  const [lang, setLang] = useState<DocsLang>('QC')
  const ui = UI_TEXT[lang]
  const navGroups = useMemo(() => groupEntriesBySection(DOC_PAGE_ENTRIES), [])
  const homeEntry = DOC_PAGE_ENTRIES.find((entry) => entry.routePath === '/')

  return (
    <Shell mode="console">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-vw-console-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/vaultwares-minimal-gold-filled.png" alt="VaultWares" className="h-8 w-8" />
            <div>
              <div className="font-mono text-sm uppercase tracking-wide text-vw-console-gold">{ui.docsTitle}</div>
              <div className="text-xs text-violet-100/60">{ui.subtitle}</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Led status="sync" size={9} pulse />
            <button
              onClick={() => setLang((prev) => (prev === 'EN' ? 'QC' : 'EN'))}
              className="rounded-xl border border-white/10 bg-vw-console-raised px-3 py-1.5 font-mono text-xs text-violet-100/80 hover:text-white"
            >
              {lang}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-57px)] w-full max-w-[1440px] items-stretch">
        <aside className="hidden w-80 shrink-0 border-r border-white/5 bg-vw-console-bg lg:block">
          <div className="sticky top-[57px] max-h-[calc(100vh-57px)] overflow-y-auto px-3 py-5">
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
                      <NavItemLabel entry={entry} lang={lang} />
                    </NavLink>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <Routes>
            {homeEntry ? <Route path="/" element={<DocPage entry={homeEntry} lang={lang} />} /> : null}
            {DOC_PAGE_ENTRIES.filter((entry) => entry.routePath !== '/').map((entry) => (
              <Route key={entry.routeKey} path={entry.routePath} element={<DocPage entry={entry} lang={lang} />} />
            ))}
            {homeEntry ? (
              <Route path="*" element={<Navigate to="/" replace />} />
            ) : (
              <Route path="*" element={<div>{ui.missingIndex}</div>} />
            )}
          </Routes>
        </main>
      </div>
    </Shell>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
