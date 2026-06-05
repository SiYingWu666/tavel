import { Bot } from 'lucide-react'
import type { AIAdvice } from '../../types'

export function AdvisorPanel({ advice }: { advice: AIAdvice }) {
  return (
    <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
      <div className="flex items-center gap-2 font-semibold text-teal-950"><Bot size={16} /> {advice.title}</div>
      <p className="mt-2 text-sm leading-6 text-teal-800">{advice.summary}</p>
    </div>
  )
}
