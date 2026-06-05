import { Plus, Trash2 } from 'lucide-react'
import type { BudgetItem, TripPlan } from '../../types'
import { calculateBudget } from '../../utils/budgetEngine'
import { Metric, Panel, SectionHeader } from '../Layout/UI'

export function BudgetPage({ plan, setPlan }: { plan: TripPlan; setPlan: React.Dispatch<React.SetStateAction<TripPlan>> }) {
  const result = calculateBudget(plan.budgetItems, plan.members)
  const addItem = () => {
    const item: BudgetItem = { id: `b-${Date.now()}`, name: '新增预算项', category: '活动', amount: 800, splitAll: true, participants: plan.members.map((member) => member.id) }
    setPlan((current) => ({ ...current, budgetItems: [...current.budgetItems, item] }))
  }
  return (
    <>
      <SectionHeader title="预算分摊" desc="支持分类预算、AA 分摊、部分成员参与分摊和个人超预算提示。" action={<button className="btn-primary" onClick={addItem}><Plus size={16} /> 新增预算项</button>} />
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Metric label="总预算" value={`¥${result.total}`} />
        <Metric label="人均预算" value={`¥${result.average}`} tone="yellow" />
        <Metric label="风险人数" value={`${result.risks.length}`} tone="coral" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel>
          <div className="space-y-3">
            {plan.budgetItems.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-lg border border-slate-100 p-3 md:grid-cols-[1fr_150px_120px_40px] md:items-center">
                <input className="input" value={item.name} onChange={(event) => setPlan((current) => ({ ...current, budgetItems: current.budgetItems.map((budget) => budget.id === item.id ? { ...budget, name: event.target.value } : budget) }))} />
                <select className="input" value={item.category} onChange={(event) => setPlan((current) => ({ ...current, budgetItems: current.budgetItems.map((budget) => budget.id === item.id ? { ...budget, category: event.target.value as BudgetItem['category'] } : budget) }))}>
                  {['往返交通', '市内交通', '住宿', '餐饮', '门票', '活动', '购物', '备用金', '随机活动预算'].map((category) => <option key={category}>{category}</option>)}
                </select>
                <input className="input" type="number" value={item.amount} onChange={(event) => setPlan((current) => ({ ...current, budgetItems: current.budgetItems.map((budget) => budget.id === item.id ? { ...budget, amount: Number(event.target.value) } : budget) }))} />
                <button className="icon-btn" onClick={() => setPlan((current) => ({ ...current, budgetItems: current.budgetItems.filter((budget) => budget.id !== item.id) }))}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="font-semibold">每人应付</h2>
          <div className="mt-4 space-y-3">
            {plan.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm">{member.name}</span>
                <span className={`font-semibold ${(result.perMember[member.id] || 0) > member.preference.budgetMax ? 'text-orange-600' : ''}`}>¥{Math.round(result.perMember[member.id] || 0)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">{result.risks.map((risk) => <p key={risk} className="rounded-md bg-orange-50 px-3 py-2 text-sm text-orange-800">{risk}</p>)}</div>
        </Panel>
      </div>
    </>
  )
}
