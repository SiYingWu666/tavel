import { Download, RotateCcw, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import type { TripMemory, TripPlan } from '../../types'
import { Panel, SectionHeader } from '../Layout/UI'

interface SettingsPageProps {
  plan: TripPlan
  setPlan: React.Dispatch<React.SetStateAction<TripPlan>>
  resetDemo: () => void
  clearLocal: () => void
  exportJson: () => string
  importJson: (json: string) => void
}

export function SettingsPage({ plan, setPlan, resetDemo, clearLocal, exportJson, importJson }: SettingsPageProps) {
  const [json, setJson] = useState('')
  const [historyJson, setHistoryJson] = useState('')

  const updateBrand = (patch: Partial<TripPlan['brand']>) => {
    setPlan((current) => ({ ...current, brand: { ...current.brand, ...patch } }))
  }

  const importHistory = () => {
    const parsed = JSON.parse(historyJson) as TripMemory[] | { tripMemories?: TripMemory[] }
    const imported = Array.isArray(parsed) ? parsed : parsed.tripMemories
    if (!imported?.length) return
    setPlan((current) => ({ ...current, tripMemories: imported }))
  }

  return (
    <>
      <SectionHeader title="设置 / 数据管理" desc="管理本地数据、团体品牌、旅行记录和未来在线版预留设计。" />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel>
          <h2 className="font-semibold">团体品牌设置</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-100 bg-slate-950">
            <img src={plan.brand.groupCoverSrc} alt="团体封面" className="h-44 w-full object-cover opacity-90" />
            <div className="flex items-center gap-3 p-4 text-white">
              <img src={plan.brand.groupIconSrc} alt="" className="h-14 w-14 rounded-xl object-cover" />
              <div>
                <p className="text-lg font-semibold">{plan.brand.groupName}</p>
                <p className="text-sm text-slate-300">{plan.brand.groupSubtitle || '副标题为空，可在下方填写或保持空白。'}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="field">App 显示名<input value={plan.brand.appName} onChange={(event) => updateBrand({ appName: event.target.value })} /></label>
            <label className="field">团体名称<input value={plan.brand.groupName} onChange={(event) => updateBrand({ groupName: event.target.value })} /></label>
          </div>
          <label className="field mt-3">副标题<input value={plan.brand.groupSubtitle} placeholder="默认留空" onChange={(event) => updateBrand({ groupSubtitle: event.target.value })} /></label>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="field">小图标路径<input value={plan.brand.groupIconSrc} onChange={(event) => updateBrand({ groupIconSrc: event.target.value })} /></label>
            <label className="field">封面路径<input value={plan.brand.groupCoverSrc} onChange={(event) => updateBrand({ groupCoverSrc: event.target.value })} /></label>
          </div>
        </Panel>

        <Panel>
          <h2 className="font-semibold">本地数据</h2>
          <p className="mt-2 text-sm text-slate-500">页面刷新后数据会保留在 localStorage。当前计划包含 {plan.members.length} 名成员、{plan.destinations.length} 个目的地、{plan.tripMemories.length} 条旅行记录。</p>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            <button className="btn-secondary" onClick={resetDemo}><RotateCcw size={16} /> 重置 Demo 数据</button>
            <button className="btn-secondary" onClick={clearLocal}><Trash2 size={16} /> 清空本地数据</button>
            <button className="btn-secondary" onClick={() => setJson(exportJson())}><Download size={16} /> 导出完整 JSON</button>
            <button className="btn-secondary" onClick={() => importJson(json)}><Upload size={16} /> 导入完整 JSON</button>
          </div>
          <textarea value={json} onChange={(event) => setJson(event.target.value)} className="mt-4 min-h-56 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs outline-none focus:border-teal-400" placeholder="导出的完整 JSON 会显示在这里，也可以粘贴 JSON 后导入。" />
        </Panel>

        <Panel>
          <h2 className="font-semibold">旅行记录 JSON</h2>
          <p className="mt-2 text-sm text-slate-500">仅导入或导出历史旅行记录，适合从别的 TripVote 备份合并记录。</p>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            <button className="btn-secondary" onClick={() => setHistoryJson(JSON.stringify(plan.tripMemories, null, 2))}><Download size={16} /> 导出历史</button>
            <button className="btn-secondary" onClick={importHistory}><Upload size={16} /> 导入历史</button>
          </div>
          <textarea value={historyJson} onChange={(event) => setHistoryJson(event.target.value)} className="mt-4 min-h-56 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs outline-none focus:border-teal-400" placeholder="可粘贴 TripMemory[]，或包含 tripMemories 字段的完整备份 JSON。" />
        </Panel>

        <Panel>
          <h2 className="font-semibold">未来在线版预留</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <p>未来可从 `useTripStore.ts` 替换为 Supabase / Firebase 数据源，组件层继续使用 `TripPlan` 数据结构。</p>
            <p>AI 助手当前走 `localRuleAdvisor`，以后可在 `aiAdvisor.ts` 增加远程 provider，保持 `AIAdviceInput` 和 `AIAdvice` 不变。</p>
            <p>旅行记录当前存在 localStorage；如果未来上线 AppStore 或云端同步，建议把照片上传到对象存储，只在 `TripMemory.photos` 中保存 URL。</p>
          </div>
        </Panel>
      </div>
    </>
  )
}
