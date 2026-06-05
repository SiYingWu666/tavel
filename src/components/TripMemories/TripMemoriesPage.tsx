import { CalendarDays, Download, ImagePlus, MapPin, Plus, Trash2, Upload } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { TripMemory, TripPlan } from '../../types'
import { Metric, Panel, SectionHeader, Tag } from '../Layout/UI'

const today = new Date().toISOString().slice(0, 10)

function createBlankMemory(plan: TripPlan): TripMemory {
  return {
    id: `memory-${Date.now()}`,
    title: '新的旅行记录',
    destination: '待填写目的地',
    location: '待填写地点',
    startDate: today,
    endDate: today,
    coverPhoto: plan.brand.groupCoverSrc,
    photos: [plan.brand.groupCoverSrc],
    members: plan.members.map((member) => member.name),
    highlights: ['写下这次旅行最想记住的瞬间'],
    budgetPerPerson: 0,
    days: 1,
    tags: ['旅行记录'],
    source: 'manual',
    createdAt: new Date().toISOString(),
  }
}

function splitText(value: string) {
  return value
    .split(/[,，\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatDateRange(memory: TripMemory) {
  return memory.startDate === memory.endDate ? memory.startDate : `${memory.startDate} - ${memory.endDate}`
}

export function TripMemoriesPage({ plan, setPlan }: { plan: TripPlan; setPlan: React.Dispatch<React.SetStateAction<TripPlan>> }) {
  const [selectedId, setSelectedId] = useState(plan.tripMemories[0]?.id ?? '')
  const [json, setJson] = useState('')
  const selected = plan.tripMemories.find((memory) => memory.id === selectedId) ?? plan.tripMemories[0]

  const stats = useMemo(() => {
    const cities = new Set(plan.tripMemories.map((memory) => memory.destination))
    return {
      count: plan.tripMemories.length,
      cities: cities.size,
      days: plan.tripMemories.reduce((sum, memory) => sum + memory.days, 0),
      budget: plan.tripMemories.reduce((sum, memory) => sum + memory.budgetPerPerson * Math.max(1, memory.members.length), 0),
    }
  }, [plan.tripMemories])

  const updateMemory = (id: string, patch: Partial<TripMemory>) => {
    setPlan((current) => ({
      ...current,
      tripMemories: current.tripMemories.map((memory) => (memory.id === id ? { ...memory, ...patch } : memory)),
    }))
  }

  const addMemory = () => {
    const next = createBlankMemory(plan)
    setSelectedId(next.id)
    setPlan((current) => ({ ...current, tripMemories: [next, ...current.tripMemories] }))
  }

  const deleteMemory = (id: string) => {
    setPlan((current) => ({ ...current, tripMemories: current.tripMemories.filter((memory) => memory.id !== id) }))
    setSelectedId(plan.tripMemories.find((memory) => memory.id !== id)?.id ?? '')
  }

  const importMemories = () => {
    const parsed = JSON.parse(json) as TripMemory[] | { tripMemories?: TripMemory[] }
    const imported = Array.isArray(parsed) ? parsed : parsed.tripMemories
    if (!imported?.length) return
    setPlan((current) => ({ ...current, tripMemories: imported.map((memory) => ({ ...memory, source: memory.source ?? 'imported' })) }))
    setSelectedId(imported[0].id)
  }

  const importPhoto = (file: File, memory: TripMemory) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      updateMemory(memory.id, { coverPhoto: result, photos: [result, ...memory.photos.filter((photo) => photo !== result)] })
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <SectionHeader
        title="旅行记录"
        desc="保存五人帮 CLUB·5 的以往旅行：照片、地点、时间、成员、花费、亮点和标签都会沉淀在这里。"
        action={
          <button className="btn-primary" onClick={addMemory}>
            <Plus size={16} /> 新增记录
          </button>
        }
      />

      <Panel className="mb-4 overflow-hidden p-0">
        <div className="grid gap-4 md:grid-cols-[320px_1fr]">
          <div className="min-h-56 bg-slate-950">
            <img src={plan.brand.groupCoverSrc} alt="五人帮 CLUB·5 团体封面" className="h-full w-full object-cover opacity-90" />
          </div>
          <div className="p-5">
            <div className="flex items-start gap-3">
              <img src={plan.brand.groupIconSrc} alt="" className="h-14 w-14 rounded-xl bg-slate-950 object-cover" />
              <div>
                <p className="text-sm text-slate-500">小团体档案</p>
                <h2 className="text-2xl font-semibold">{plan.brand.groupName}</h2>
                {plan.brand.groupSubtitle && <p className="mt-1 text-sm text-slate-500">{plan.brand.groupSubtitle}</p>}
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <Metric label="记录次数" value={`${stats.count}`} />
              <Metric label="去过地点" value={`${stats.cities}`} tone="yellow" />
              <Metric label="累计天数" value={`${stats.days}`} tone="coral" />
              <Metric label="累计估算" value={`¥${stats.budget}`} tone="slate" />
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          {plan.tripMemories.map((memory) => (
            <Panel key={memory.id} className="content-visibility-auto">
              <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                <button type="button" onClick={() => setSelectedId(memory.id)} className="overflow-hidden rounded-lg bg-slate-100 text-left">
                  <img loading="lazy" src={memory.coverPhoto || plan.brand.groupCoverSrc} alt={memory.title} className="h-44 w-full object-cover transition hover:scale-[1.02]" />
                </button>
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-teal-700">{memory.source === 'archived-plan' ? '由最终方案归档' : memory.source === 'imported' ? '导入记录' : '手动记录'}</p>
                      <h2 className="mt-1 text-xl font-semibold">{memory.title}</h2>
                    </div>
                    <button className="icon-btn" onClick={() => deleteMemory(memory.id)} aria-label="删除记录">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1"><MapPin size={15} /> {memory.location}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays size={15} /> {formatDateRange(memory)}</span>
                    <span>{memory.members.length} 人同行</span>
                    <span>人均 ¥{memory.budgetPerPerson}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">{memory.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                  <ul className="mt-4 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                    {memory.highlights.map((highlight) => <li key={highlight} className="rounded-md bg-slate-50 px-3 py-2">{highlight}</li>)}
                  </ul>
                </div>
              </div>
            </Panel>
          ))}
        </div>

        <div className="space-y-4">
          <Panel>
            <h2 className="font-semibold">编辑选中记录</h2>
            {selected ? (
              <div className="mt-4 space-y-3">
                <label className="field">标题<input value={selected.title} onChange={(event) => updateMemory(selected.id, { title: event.target.value })} /></label>
                <label className="field">目的地<input value={selected.destination} onChange={(event) => updateMemory(selected.id, { destination: event.target.value })} /></label>
                <label className="field">地点<input value={selected.location} onChange={(event) => updateMemory(selected.id, { location: event.target.value })} /></label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="field">开始日期<input type="date" value={selected.startDate} onChange={(event) => updateMemory(selected.id, { startDate: event.target.value })} /></label>
                  <label className="field">结束日期<input type="date" value={selected.endDate} onChange={(event) => updateMemory(selected.id, { endDate: event.target.value })} /></label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="field">人均预算<input type="number" value={selected.budgetPerPerson} onChange={(event) => updateMemory(selected.id, { budgetPerPerson: Number(event.target.value) })} /></label>
                  <label className="field">天数<input type="number" value={selected.days} onChange={(event) => updateMemory(selected.id, { days: Number(event.target.value) })} /></label>
                </div>
                <label className="field">标签<input value={selected.tags.join('，')} onChange={(event) => updateMemory(selected.id, { tags: splitText(event.target.value) })} /></label>
                <label className="field">成员<input value={selected.members.join('，')} onChange={(event) => updateMemory(selected.id, { members: splitText(event.target.value) })} /></label>
                <label className="field">亮点<textarea className="input min-h-24" value={selected.highlights.join('\n')} onChange={(event) => updateMemory(selected.id, { highlights: splitText(event.target.value) })} /></label>
                <label className="btn-secondary w-full">
                  <ImagePlus size={16} /> 上传封面照片
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && importPhoto(event.target.files[0], selected)} />
                </label>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">还没有旅行记录，先新增一条。</p>
            )}
          </Panel>

          <Panel>
            <h2 className="font-semibold">导入 / 导出历史 JSON</h2>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <button className="btn-secondary" onClick={() => setJson(JSON.stringify(plan.tripMemories, null, 2))}><Download size={16} /> 导出历史</button>
              <button className="btn-secondary" onClick={importMemories}><Upload size={16} /> 导入历史</button>
            </div>
            <textarea value={json} onChange={(event) => setJson(event.target.value)} className="mt-4 min-h-48 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs outline-none focus:border-teal-400" placeholder="可粘贴 TripMemory[]，或包含 tripMemories 字段的完整备份 JSON。" />
          </Panel>
        </div>
      </div>
    </>
  )
}
