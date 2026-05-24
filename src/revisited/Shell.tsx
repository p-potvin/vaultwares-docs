import type { ReactNode } from 'react'

interface ShellProps {
  mode: 'console' | 'warm'
  children: ReactNode
  className?: string
}

export function Shell({ mode, children, className = '' }: ShellProps) {
  const shellClass = mode === 'console' ? 'vw-console-shell' : 'vw-warm-shell'
  return <div className={`min-h-screen w-full flex flex-col font-sans ${shellClass} ${className}`}>{children}</div>
}
