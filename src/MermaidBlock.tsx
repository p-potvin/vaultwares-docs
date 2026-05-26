import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, text: string) => Promise<{ svg: string; bindFunctions?: (element: Element) => void }>
}

declare global {
  interface Window {
    mermaid?: MermaidApi
  }
}

let mermaidLoader: Promise<MermaidApi> | null = null

function loadMermaid(): Promise<MermaidApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Mermaid can only load in the browser'))
  }

  if (window.mermaid) return Promise.resolve(window.mermaid)
  if (mermaidLoader) return mermaidLoader

  mermaidLoader = new Promise<MermaidApi>((resolve, reject) => {
    const existing = document.querySelector('script[data-vw-mermaid]')
    if (existing) {
      const done = () => (window.mermaid ? resolve(window.mermaid) : reject(new Error('Mermaid failed to load')))
      existing.addEventListener('load', done, { once: true })
      existing.addEventListener('error', () => reject(new Error('Mermaid script failed to load')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.dataset.vwMermaid = '1'
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    script.async = true
    script.onload = () => {
      if (!window.mermaid) {
        reject(new Error('Mermaid loaded but window.mermaid is missing'))
        return
      }
      resolve(window.mermaid)
    }
    script.onerror = () => reject(new Error('Mermaid script failed to load'))
    document.head.appendChild(script)
  })

  return mermaidLoader
}

function pickTheme(): 'default' | 'dark' {
  // Diagrams render inside a light card for contrast/readability, so keep Mermaid in its
  // light theme regardless of OS preference.
  return 'default'
}

function toSafeDomId(id: string) {
  const safe = id.replace(/[^a-zA-Z0-9_-]/g, '')
  return safe.length ? safe : 'vw'
}

export function MermaidBlock({ chart }: { chart: string }) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const autoFitDoneRef = useRef(false)
  const renderId = useId()
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(1)

  const normalizedChart = useMemo(() => chart.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim(), [chart])
  const safeRenderId = useMemo(() => `vw-mermaid-${toSafeDomId(renderId)}`, [renderId])
  const clampScale = useCallback((value: number) => Math.min(4, Math.max(0.5, value)), [])
  const scaleRef = useRef(scale)

  useEffect(() => {
    scaleRef.current = scale
  }, [scale])

  useEffect(() => {
    let cancelled = false
    autoFitDoneRef.current = false

    async function render() {
      setError(null)
      const el = containerRef.current
      if (!el || !normalizedChart) return

      try {
        const mermaid = await loadMermaid()
        if (cancelled) return

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: pickTheme(),
        })

        const { svg, bindFunctions } = await mermaid.render(safeRenderId, normalizedChart)
        if (cancelled) return

        el.innerHTML = svg
        bindFunctions?.(el)

        const svgEl = el.querySelector('svg')
        if (svgEl) {
          svgEl.setAttribute('preserveAspectRatio', 'xMinYMin meet')
          svgEl.style.display = 'block'
          svgEl.style.maxWidth = 'none'
          svgEl.style.height = 'auto'

          // If the diagram is tiny, automatically scale up once so it is readable.
          requestAnimationFrame(() => {
            if (cancelled) return
            if (autoFitDoneRef.current) return
            if (scaleRef.current !== 1) return

            const viewport = viewportRef.current
            const svgNode = el.querySelector('svg') as SVGSVGElement | null
            if (!viewport || !svgNode) return

            const available = Math.max(1, viewport.clientWidth - 12)
            const viewBox = svgNode.viewBox?.baseVal
            const intrinsicWidth =
              viewBox && viewBox.width
                ? viewBox.width
                : (() => {
                    try {
                      return svgNode.getBBox().width || 1
                    } catch {
                      return 1
                    }
                  })()

            const ratio = available / Math.max(1, intrinsicWidth)
            if (ratio > 1.25) setScale(clampScale(ratio))
            autoFitDoneRef.current = true
          })
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e))
      }
    }

    render()
    return () => {
      cancelled = true
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [normalizedChart, safeRenderId, clampScale])

  const zoomIn = useCallback(() => setScale((prev) => clampScale(Number((prev + 0.2).toFixed(2)))), [clampScale])
  const zoomOut = useCallback(() => setScale((prev) => clampScale(Number((prev - 0.2).toFixed(2)))), [clampScale])
  const resetZoom = useCallback(() => setScale(1), [])

  const fitToWidth = useCallback(() => {
    const viewport = viewportRef.current
    const host = containerRef.current
    const svgEl = host?.querySelector('svg') as SVGSVGElement | null
    if (!viewport || !svgEl) return

    const available = Math.max(1, viewport.clientWidth - 12)
    const viewBox = svgEl.viewBox?.baseVal
    const intrinsicWidth =
      viewBox && viewBox.width
        ? viewBox.width
        : (() => {
            try {
              return svgEl.getBBox().width || 1
            } catch {
              return 1
            }
          })()

    setScale(clampScale(available / Math.max(1, intrinsicWidth)))
    viewport.scrollLeft = 0
  }, [clampScale])

  if (error) {
    return (
      <div className="my-4 rounded-2xl border border-vw-signal-warning/60 bg-vw-console-raised/70 p-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-wide text-vw-console-gold">Mermaid error</div>
        <div className="text-sm leading-relaxed text-violet-100/70">
          Could not render the diagram. Showing the source instead.
        </div>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-black/30 p-3 text-xs text-violet-100/70">
          <code>{normalizedChart}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className="my-5 rounded-2xl border border-white/5 bg-vw-console-raised/55">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 px-3 py-2">
        <div className="font-mono text-[11px] uppercase tracking-widest text-violet-100/55">Diagramme</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fitToWidth}
            className="rounded-lg border border-white/10 bg-black/15 px-2 py-1 font-mono text-[11px] text-violet-100/75 hover:text-white"
          >
            Fit
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="rounded-lg border border-white/10 bg-black/15 px-2 py-1 font-mono text-[11px] text-violet-100/75 hover:text-white"
            aria-label="Zoom out"
          >
            -
          </button>
          <div className="min-w-[56px] text-center font-mono text-[11px] text-violet-100/70" aria-label="Zoom level">
            {Math.round(scale * 100)}%
          </div>
          <button
            type="button"
            onClick={zoomIn}
            className="rounded-lg border border-white/10 bg-black/15 px-2 py-1 font-mono text-[11px] text-violet-100/75 hover:text-white"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="rounded-lg border border-white/10 bg-black/15 px-2 py-1 font-mono text-[11px] text-violet-100/75 hover:text-white"
          >
            Reset
          </button>
        </div>
      </div>

      <div ref={viewportRef} className="max-h-[70vh] overflow-auto px-3 py-3">
        <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
          <div
            ref={containerRef}
            className="rounded-xl border border-white/5 bg-white/[0.96] p-3 text-black"
          />
        </div>
      </div>
    </div>
  )
}
