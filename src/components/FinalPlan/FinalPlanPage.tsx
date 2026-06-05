import { Archive, Copy, FileText } from 'lucide-react'
import type { TripMemory, TripPlan } from '../../types'
import { generateAIAdvice } from '../../utils/aiAdvisor'
import { calculateBudget } from '../../utils/budgetEngine'
import { calculateDestinationDecisions } from '../../utils/decisionEngine'
import { analyzeDay } from '../../utils/itineraryEngine'
import { Panel, SectionHeader, Tag } from '../Layout/UI'

function buildText(plan: TripPlan) {
  const decisions = calculateDestinationDecisions(plan.destinations, plan.members, plan.votes)
  const best = plan.destinations.find((item) => item.id === plan.finalDestinationId) || decisions[0].destination
  const decision = decisions.find((item) => item.destination.id === best.id) || decisions[0]
  const budget = calculateBudget(plan.budgetItems, plan.members)
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
  const days = plan.itinerary.map((day) => {
    const analysis = analyzeDay(day, plan.activities)
    return `Day ${day.dayIndex}：${analysis.activities.map((activity) => activity.name).join(' + ') || '自由活动 / 休整'}`
  }).join('\n')

  return `本次旅行推荐目的地：${best.name}
推荐理由：${decision.recommendation}
预计人均预算：${budget.average} 元
建议天数：${best.suggestedDays} 天
共识度：${decision.consensus}%
主要风险：${decision.risks.slice(0, 2).join('；')}

每日行程：
${days}

必去活动：${plan.activities.filter((activity) => activity.destinationId === best.id && activity.mustGo).map((activity) => activity.name).join('、') || '待团队确认'}
随机挑战：${plan.randomResults[0]?.challengeCards.map((card) => card.title).join('、') || '八人同框'}

省钱建议：${advice.savingOption}
更刺激建议：${advice.excitingOption}
更轻松建议：${advice.relaxedOption}`
}

function createMemoryFromPlan(plan: TripPlan): TripMemory {
  const decisions = calculateDestinationDecisions(plan.destinations, plan.members, plan.votes)
  const best = plan.destinations.find((item) => item.id === plan.finalDestinationId) || decisions[0].destination
  const budget = calculateBudget(plan.budgetItems, plan.members)
  const today = new Date().toISOString().slice(0, 10)
  const highlights = [
    `推荐理由：${decisions.find((item) => item.destination.id === best.id)?.strengths.slice(0, 2).join('、') || '综合均衡'}`,
    `共识度：${decisions.find((item) => item.destination.id === best.id)?.consensus ?? 0}%`,
    plan.randomResults[0] ? `随机挑战：${plan.randomResults[0].challengeCards.map((card) => card.title).join('、')}` : '可从最终方案继续补充照片和亮点',
  ]

  return {
    id: `memory-archive-${Date.now()}`,
    title: `${best.name}旅行方案归档`,
    destination: best.name,
    location: best.location,
    startDate: today,
    endDate: today,
    coverPhoto: plan.brand.groupCoverSrc,
    photos: [plan.brand.groupCoverSrc],
    members: plan.members.map((member) => member.name),
    highlights,
    budgetPerPerson: budget.average,
    days: best.suggestedDays,
    tags: best.tags,
    source: 'archived-plan',
    createdAt: new Date().toISOString(),
    linkedDestinationId: best.id,
  }
}

export function FinalPlanPage({ plan, setPlan }: { plan: TripPlan; setPlan: React.Dispatch<React.SetStateAction<TripPlan>> }) {
  const decisions = calculateDestinationDecisions(plan.destinations, plan.members, plan.votes)
  const bestId = plan.finalDestinationId || decisions[0].destination.id
  const text = buildText(plan)

  const archivePlan = () => {
    const memory = createMemoryFromPlan(plan)
    setPlan((current) => ({ ...current, tripMemories: [memory, ...current.tripMemories] }))
  }

  return (
    <>
      <SectionHeader title="最终方案" desc="自动生成可发到微信群的旅行建议，也可以把当前方案归档进旅行记录。" />
      <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
        <Panel>
          <h2 className="font-semibold">选择最终目的地</h2>
          <div className="mt-4 space-y-2">
            {decisions.slice(0, 6).map((item) => (
              <button key={item.destination.id} onClick={() => setPlan((current) => ({ ...current, finalDestinationId: item.destination.id }))} className={`w-full rounded-lg px-3 py-3 text-left text-sm ${bestId === item.destination.id ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-700'}`}>
                <span className="font-semibold">{item.destination.name}</span>
                <span className="ml-2 opacity-70">{item.totalScore} 分</span>
              </button>
            ))}
          </div>
          <button className="btn-primary mt-4 w-full" onClick={archivePlan}>
            <Archive size={16} /> 一键归档到旅行记录
          </button>
        </Panel>
        <Panel>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2"><Tag>微信群文本</Tag><Tag>本地生成</Tag></div>
            <button className="btn-primary" onClick={() => navigator.clipboard?.writeText(text)}><Copy size={16} /> 复制方案</button>
          </div>
          <pre className="max-h-[620px] overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-5 text-sm leading-7 text-slate-100"><FileText size={16} className="mb-3" />{text}</pre>
        </Panel>
      </div>
    </>
  )
}
