import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type GenericProps = {
  children?: ReactNode
  [key: string]: unknown
}

type CardProps = GenericProps & {
  href?: string
  title?: string
}

type CardGroupProps = GenericProps & {
  cols?: string | number
}

type TitleProps = GenericProps & {
  title?: string
}

type FieldProps = GenericProps & {
  path?: string
  name?: string
  body?: string
  query?: string
  header?: string
  type?: string
}

function parseIntOr<T>(value: unknown, fallback: T): number | T {
  const parsed = Number.parseInt(String(value ?? ''), 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toChildren(content: ReactNode): ReactNode {
  return <div className="text-sm leading-relaxed text-violet-100/70">{content}</div>
}

function Callout({ tone, children }: { tone: 'info' | 'tip' | 'warn' | 'ok'; children: ReactNode }) {
  const toneClass =
    tone === 'warn'
      ? 'border-vw-signal-warning/60 bg-vw-console-raised/70'
      : tone === 'tip'
        ? 'border-vw-signal-sync/50 bg-vw-console-raised/65'
        : tone === 'ok'
          ? 'border-vw-signal-online/50 bg-vw-console-raised/65'
          : 'border-vw-signal-relay/45 bg-vw-console-raised/65'

  return <div className={`my-5 rounded-2xl border px-4 py-3 ${toneClass}`}>{toChildren(children)}</div>
}

function Card(props: CardProps) {
  const href = props.href ? String(props.href) : ''
  const title = props.title ? String(props.title) : 'Card'
  const children = props.children
  const shell = (
    <div className="vw-card h-full rounded-2xl p-4 transition-colors hover:bg-vw-console-elevated/80">
      <h3 className="mb-2 font-mono text-sm font-semibold text-white">{title}</h3>
      {toChildren(children)}
    </div>
  )

  if (href.startsWith('/')) {
    return <Link to={href}>{shell}</Link>
  }
  return shell
}

function CardGroup(props: CardGroupProps) {
  const cols = parseIntOr(props.cols, 2)
  const colClass = cols === 3 ? 'md:grid-cols-3' : cols === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'
  return <div className={`my-6 grid grid-cols-1 gap-4 ${colClass}`}>{props.children}</div>
}

function Steps({ children }: { children: ReactNode }) {
  return <ol className="my-6 space-y-3">{children}</ol>
}

function Step(props: TitleProps) {
  const title = props.title ? String(props.title) : 'Step'
  return (
    <li className="rounded-2xl border border-white/5 bg-vw-console-raised/55 p-4">
      <div className="mb-2 font-mono text-xs uppercase tracking-wide text-vw-console-gold">{title}</div>
      {toChildren(props.children)}
    </li>
  )
}

function Tabs({ children }: { children: ReactNode }) {
  return <div className="my-6 space-y-4">{children}</div>
}

function Tab(props: TitleProps) {
  const title = props.title ? String(props.title) : 'Tab'
  return (
    <section className="rounded-2xl border border-white/5 bg-vw-console-raised/55 p-4">
      <h4 className="mb-2 font-mono text-xs uppercase tracking-wide text-vw-console-gold">{title}</h4>
      {toChildren(props.children)}
    </section>
  )
}

function AccordionGroup({ children }: { children: ReactNode }) {
  return <div className="my-6 space-y-3">{children}</div>
}

function Accordion(props: TitleProps) {
  const title = props.title ? String(props.title) : 'Details'
  return (
    <details className="rounded-2xl border border-white/5 bg-vw-console-raised/55 p-4">
      <summary className="cursor-pointer font-mono text-sm text-white">{title}</summary>
      <div className="pt-3">{toChildren(props.children)}</div>
    </details>
  )
}

function SimpleBlock({ children }: { children: ReactNode }) {
  return <div className="my-4">{toChildren(children)}</div>
}

function FieldBlock(props: FieldProps) {
  const attrs = [
    props.path ? `path: ${String(props.path)}` : '',
    props.name ? `name: ${String(props.name)}` : '',
    props.body ? `body: ${String(props.body)}` : '',
    props.query ? `query: ${String(props.query)}` : '',
    props.header ? `header: ${String(props.header)}` : '',
    props.type ? `type: ${String(props.type)}` : '',
  ].filter(Boolean)

  return (
    <div className="my-3 rounded-xl border border-white/5 bg-vw-console-raised/55 px-3 py-2">
      {attrs.length > 0 ? <div className="mb-1 font-mono text-xs text-vw-console-gold">{attrs.join(' | ')}</div> : null}
      {toChildren(props.children)}
    </div>
  )
}

export const markdownComponents = {
  card: (props: GenericProps) => <Card {...(props as CardProps)} />,
  cardgroup: (props: GenericProps) => <CardGroup {...(props as CardGroupProps)} />,
  note: ({ children }: GenericProps) => <Callout tone="info">{children}</Callout>,
  info: ({ children }: GenericProps) => <Callout tone="info">{children}</Callout>,
  tip: ({ children }: GenericProps) => <Callout tone="tip">{children}</Callout>,
  warning: ({ children }: GenericProps) => <Callout tone="warn">{children}</Callout>,
  check: ({ children }: GenericProps) => <Callout tone="ok">{children}</Callout>,
  steps: ({ children }: GenericProps) => <Steps>{children}</Steps>,
  step: (props: GenericProps) => <Step {...(props as TitleProps)} />,
  tabs: ({ children }: GenericProps) => <Tabs>{children}</Tabs>,
  tab: (props: GenericProps) => <Tab {...(props as TitleProps)} />,
  accordiongroup: ({ children }: GenericProps) => <AccordionGroup>{children}</AccordionGroup>,
  accordion: (props: GenericProps) => <Accordion {...(props as TitleProps)} />,
  codegroup: ({ children }: GenericProps) => <SimpleBlock>{children}</SimpleBlock>,
  requestexample: ({ children }: GenericProps) => <SimpleBlock>{children}</SimpleBlock>,
  responseexample: ({ children }: GenericProps) => <SimpleBlock>{children}</SimpleBlock>,
  frame: ({ children }: GenericProps) => <SimpleBlock>{children}</SimpleBlock>,
  tooltip: ({ children }: GenericProps) => <SimpleBlock>{children}</SimpleBlock>,
  update: ({ children }: GenericProps) => <SimpleBlock>{children}</SimpleBlock>,
  expandable: ({ children }: GenericProps) => <SimpleBlock>{children}</SimpleBlock>,
  paramfield: (props: GenericProps) => <FieldBlock {...(props as FieldProps)} />,
  responsefield: (props: GenericProps) => <FieldBlock {...(props as FieldProps)} />,
}
