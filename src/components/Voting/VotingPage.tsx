import type { TripPlan } from '../../types'
import { calculateDestinationDecisions } from '../../utils/decisionEngine'
import { Panel, ProgressBar, SectionHeader } from '../Layout/UI'

export function VotingPage({ plan }: { plan: TripPlan }) {
  const decisions = calculateDestinationDecisions(plan.destinations, plan.members, plan.votes)
  return (
    <>
      <SectionHeader title="投票与排名" desc="综合成员评分、个人权重、支持/反对人数、争议度和公平性提示。" />
      <div className="space-y-4">
        {decisions.map((item, index) => (
          <Panel key={item.destination.id}>
            <div className="grid gap-4 lg:grid-cols-[52px_1fr_180px] lg:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-lg font-semibold text-white">#{index + 1}</div>
              <div>
                <h2 className="text-xl font-semibold">{item.destination.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{item.recommendation}</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div><p className="text-xs text-slate-500">共识度 {item.consensus}%</p><ProgressBar value={item.consensus} /></div>
                  <div><p className="text-xs text-slate-500">争议度 {item.controversy}%</p><ProgressBar value={item.controversy} tone="orange" /></div>
                  <div><p className="text-xs text-slate-500">平均意愿 {item.averageScore}/5</p><ProgressBar value={item.averageScore * 20} tone="slate" /></div>
                </div>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-3xl font-semibold">{item.totalScore}</p>
                <p className="text-xs text-slate-500">支持 {item.supportCount} / 中立 {item.neutralCount} / 反对 {item.opposeCount}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  )
}
