import { Bot, Sparkles, TrendingUp } from 'lucide-react'
import { generateAIAdvice } from '../../utils/aiAdvisor'
import { calculateBudget } from '../../utils/budgetEngine'
import { calculateDestinationDecisions, getDecisionProgress } from '../../utils/decisionEngine'
import type { TripPlan } from '../../types'
import { Metric, Panel, ProgressBar, SectionHeader, Tag } from '../Layout/UI'

export function Dashboard({ plan, onNavigate }: { plan: TripPlan; onNavigate: (id: string) => void }) {
  const decisions = calculateDestinationDecisions(plan.destinations, plan.members, plan.votes)
  const best = decisions[0]
  const budget = calculateBudget(plan.budgetItems, plan.members)
  const progress = getDecisionProgress(plan.members, plan.destinations, plan.votes)
  const advice = generateAIAdvice({
    members: plan.members,
    destinations: plan.destinations,
    votes: plan.votes,
    activities: plan.activities,
    activityVotes: plan.activityVotes,
    itinerary: plan.itinerary,
    budgetItems: plan.budgetItems,
    randomResult: plan.randomResults[0],
  })

  return (
    <>
      <SectionHeader
        title={plan.groupName}
        desc="把目的地、偏好、预算、随机玩法和最终方案放在同一个决策台里。"
        action={<button onClick={() => onNavigate('random')} className="btn-primary"><Sparkles size={16} /> 开始随机旅行</button>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="已加入人数" value={`${plan.members.length}/8`} />
        <Metric label="已提交偏好" value={`${plan.members.filter((m) => m.preferenceSubmitted).length}/8`} tone="yellow" />
        <Metric label="候选目的地" value={`${plan.destinations.length}`} tone="coral" />
        <Metric label="人均预算" value={`¥${budget.average}`} tone="slate" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">当前最推荐</p>
              <h2 className="text-3xl font-semibold">{best.destination.name}</h2>
            </div>
            <div className="rounded-lg bg-teal-500 px-4 py-3 text-center text-white">
              <p className="text-xs">综合分</p>
              <p className="text-2xl font-semibold">{best.totalScore}</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">{best.recommendation}</p>
          <div className="mt-4 flex flex-wrap gap-2">{best.destination.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div><p className="text-xs text-slate-500">共识度</p><ProgressBar value={best.consensus} /><p className="mt-1 text-sm font-semibold">{best.consensus}%</p></div>
            <div><p className="text-xs text-slate-500">争议度</p><ProgressBar value={best.controversy} tone="orange" /><p className="mt-1 text-sm font-semibold">{best.controversy}%</p></div>
            <div><p className="text-xs text-slate-500">完成度</p><ProgressBar value={progress} tone="slate" /><p className="mt-1 text-sm font-semibold">{progress}%</p></div>
          </div>
        </Panel>
        <Panel className="!bg-slate-950 text-white">
          <div className="mb-3 flex items-center gap-2"><Bot size={18} /><h2 className="font-semibold">AI 决策助手</h2></div>
          <p className="text-sm leading-6 text-slate-200">{advice.summary}</p>
          <p className="mt-2 rounded-md bg-white/10 px-3 py-2 text-xs text-teal-100">本地规则模拟，未调用 API</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            {advice.suggestions.slice(0, 3).map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </Panel>
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <div className="mb-4 flex items-center gap-2"><TrendingUp size={18} /><h2 className="font-semibold">目的地排名</h2></div>
          <div className="space-y-3">
            {decisions.slice(0, 5).map((item, index) => (
              <div key={item.destination.id} className="grid gap-3 rounded-lg border border-slate-100 p-3 md:grid-cols-[44px_1fr_90px] md:items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 font-semibold">#{index + 1}</div>
                <div>
                  <p className="font-semibold">{item.destination.name}</p>
                  <p className="text-sm text-slate-500">{item.fairnessHint}</p>
                </div>
                <div className="text-left md:text-right"><p className="text-xl font-semibold">{item.totalScore}</p><p className="text-xs text-slate-500">{item.consensus}% 共识</p></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="font-semibold">快速入口</h2>
          <div className="mt-4 grid gap-2">
            {[
              ['members', '编辑成员偏好'],
              ['voting', '查看投票排名'],
              ['activities', '选择活动'],
              ['itinerary', '生成行程'],
              ['budget', '预算 AA 分摊'],
              ['memories', '查看旅行记录'],
              ['final', '生成最终方案'],
            ].map(([id, label]) => <button key={id} onClick={() => onNavigate(id)} className="btn-secondary justify-between">{label}<span>→</span></button>)}
          </div>
        </Panel>
      </div>
    </>
  )
}
