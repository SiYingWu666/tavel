import type { TripPlan } from '../../types'
import { Panel, ProgressBar, SectionHeader, Tag } from '../Layout/UI'

export function MembersPage({ plan, setPlan }: { plan: TripPlan; setPlan: React.Dispatch<React.SetStateAction<TripPlan>> }) {
  return (
    <>
      <SectionHeader title="成员偏好" desc="默认 8 名成员，可编辑昵称、预算、提交状态和最终确认状态。" />
      <div className="grid gap-4 xl:grid-cols-2">
        {plan.members.map((member) => (
          <Panel key={member.id}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-100 font-semibold text-teal-900">{member.avatar}</div>
              <div className="min-w-0 flex-1">
                <input
                  value={member.name}
                  onChange={(event) => setPlan((current) => ({ ...current, members: current.members.map((item) => item.id === member.id ? { ...item, name: event.target.value } : item) }))}
                  className="w-full border-0 bg-transparent text-lg font-semibold outline-none"
                />
                <p className="text-sm text-slate-500">{member.role}</p>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={member.preferenceSubmitted}
                  onChange={(event) => setPlan((current) => ({ ...current, members: current.members.map((item) => item.id === member.id ? { ...item, preferenceSubmitted: event.target.checked } : item) }))}
                />
                已提交
              </label>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="field">最低预算<input type="number" value={member.preference.budgetMin} onChange={(event) => setPlan((current) => ({ ...current, members: current.members.map((item) => item.id === member.id ? { ...item, preference: { ...item.preference, budgetMin: Number(event.target.value) } } : item) }))} /></label>
              <label className="field">最高预算<input type="number" value={member.preference.budgetMax} onChange={(event) => setPlan((current) => ({ ...current, members: current.members.map((item) => item.id === member.id ? { ...item, preference: { ...item.preference, budgetMax: Number(event.target.value) } } : item) }))} /></label>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-xs text-slate-500"><span>预算区间</span><span>¥{member.preference.budgetMin} - ¥{member.preference.budgetMax}</span></div>
              <ProgressBar value={(member.preference.budgetMax / 5000) * 100} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">{member.preference.travelStyles.map((style) => <Tag key={style}>{style}</Tag>)}</div>
          </Panel>
        ))}
      </div>
    </>
  )
}
