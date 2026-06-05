import { Download, RotateCcw, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import type { TripPlan } from '../../types'
import { Panel, SectionHeader } from '../Layout/UI'

interface SettingsPageProps {
  plan: TripPlan
  resetDemo: () => void
  clearLocal: () => void
  exportJson: () => string
  importJson: (json: string) => void
}

export function SettingsPage({ plan, resetDemo, clearLocal, exportJson, importJson }: SettingsPageProps) {
  const [json, setJson] = useState('')
  return (
    <>
      <SectionHeader title="设置 / 数据管理" desc="管理 localStorage 数据，并查看未来多人在线版本的预留设计。" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="font-semibold">本地数据</h2>
          <p className="mt-2 text-sm text-slate-500">页面刷新后数据会保留在 localStorage。当前计划包含 {plan.members.length} 名成员、{plan.destinations.length} 个目的地。</p>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            <button className="btn-secondary" onClick={resetDemo}><RotateCcw size={16} /> 重置 Demo 数据</button>
            <button className="btn-secondary" onClick={clearLocal}><Trash2 size={16} /> 清空本地数据</button>
            <button className="btn-secondary" onClick={() => setJson(exportJson())}><Download size={16} /> 导出 JSON</button>
            <button className="btn-secondary" onClick={() => importJson(json)}><Upload size={16} /> 导入 JSON</button>
          </div>
          <textarea value={json} onChange={(event) => setJson(event.target.value)} className="mt-4 min-h-72 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs outline-none focus:border-teal-400" placeholder="导出的 JSON 会显示在这里，也可以粘贴 JSON 后导入。" />
        </Panel>
        <Panel>
          <h2 className="font-semibold">未来在线版预留</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <p>未来可从 `useTripStore.ts` 替换为 Supabase / Firebase 数据源，组件层继续使用 `TripPlan` 数据结构。</p>
            <p>AI 助手当前走 `localRuleAdvisor`，以后可在 `aiAdvisor.ts` 增加 `remoteAIAdvisor`，保持 `AIAdviceInput` 和 `AIAdvice` 不变。</p>
            <p>建议表结构：users、groups、group_members、preferences、destinations、destination_votes、activities、activity_votes、itinerary_days、budget_items、random_results。</p>
          </div>
        </Panel>
      </div>
    </>
  )
}
