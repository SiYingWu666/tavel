export function SectionHeader({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-slate-950 md:text-3xl">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">{desc}</p>
      </div>
      {action}
    </div>
  )
}

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-white/80 bg-white/86 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.07)] ${className}`}>{children}</section>
}

export function Metric({ label, value, tone = 'teal' }: { label: string; value: string; tone?: 'teal' | 'coral' | 'yellow' | 'slate' }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-900',
    coral: 'bg-orange-50 text-orange-900',
    yellow: 'bg-amber-50 text-amber-900',
    slate: 'bg-slate-100 text-slate-900',
  }
  return (
    <div className={`rounded-lg p-4 ${tones[tone]}`}>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

export function ProgressBar({ value, tone = 'teal' }: { value: number; tone?: 'teal' | 'orange' | 'slate' }) {
  const color = tone === 'orange' ? 'bg-orange-400' : tone === 'slate' ? 'bg-slate-800' : 'bg-teal-500'
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{children}</span>
}
