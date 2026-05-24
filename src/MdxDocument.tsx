import { evaluate } from '@mdx-js/mdx'
import { useEffect, useMemo, useState, type ComponentType } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import * as runtime from 'react/jsx-runtime'
import { markdownComponents, mdxComponents } from './markdownComponents'
import { normalizeMdxForMarkdown, prepareMdxSource, stripTopLevelEsm } from './mdxUtils'

type MdxModule = {
  default: ComponentType<{ components?: Record<string, unknown> }>
}

const mdxCache = new Map<string, ComponentType<{ components?: Record<string, unknown> }>>()

export function MdxDocument({ source }: { source: string }) {
  const [content, setContent] = useState<ComponentType<{ components?: Record<string, unknown> }> | null>(null)
  const [failed, setFailed] = useState(false)

  const fallbackMarkdown = useMemo(() => normalizeMdxForMarkdown(source), [source])

  useEffect(() => {
    let cancelled = false
    setFailed(false)

    async function compileSource() {
      const prepared = stripTopLevelEsm(prepareMdxSource(source)).trim()
      if (!prepared) {
        if (!cancelled) {
          setContent(null)
          setFailed(false)
        }
        return
      }

      const cached = mdxCache.get(prepared)
      if (cached) {
        if (!cancelled) {
          setContent(() => cached)
          setFailed(false)
        }
        return
      }

      try {
        const mod = (await evaluate(prepared, {
          ...runtime,
          development: import.meta.env.DEV,
          remarkPlugins: [remarkGfm],
        })) as MdxModule

        mdxCache.set(prepared, mod.default)
        if (!cancelled) {
          setContent(() => mod.default)
          setFailed(false)
        }
      } catch {
        if (!cancelled) {
          setContent(null)
          setFailed(true)
        }
      }
    }

    compileSource()
    return () => {
      cancelled = true
    }
  }, [source])

  if (!failed && content) {
    const Content = content
    return <Content components={mdxComponents as Record<string, unknown>} />
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents as unknown as Components}
    >
      {fallbackMarkdown}
    </ReactMarkdown>
  )
}
