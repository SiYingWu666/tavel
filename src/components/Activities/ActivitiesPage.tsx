import type { ActivityVote, TripPlan } from '../../types'
import { Panel, SectionHeader, Tag } from '../Layout/UI'

export function ActivitiesPage({ plan, setPlan }: { plan: TripPlan; setPlan: React.Dispatch<React.SetStateAction<TripPlan>> }) {
  const summary = (activityId: string) => {
    const votes = plan.activityVotes.filter((vote) => vote.activityId === activityId)
    return {
      want: votes.filter((vote) => vote.choice === '想去').length,
      no: votes.filter((vote) => vote.choice === '不想去').length,
      neutral: votes.filter((vote) => vote.choice === '无所谓').length,
    }
  }
  const updateChoice = (vote: ActivityVote, choice: ActivityVote['choice']) => {
    setPlan((current) => ({
      ...current,
      activityVotes: current.activityVotes.map((item) => item.memberId === vote.memberId && item.activityId === vote.activityId ? { ...item, choice } : item),
    }))
  }

  return (
    <>
      <SectionHeader title="活动选择" desc="每个活动支持想去、无所谓、不想去，并自动提示受欢迎和争议情况。" />
      <div className="grid gap-4 xl:grid-cols-2">
        {plan.activities.slice(0, 12).map((activity) => {
          const destination = plan.destinations.find((item) => item.id === activity.destinationId)
          const stats = summary(activity.id)
          const votes = plan.activityVotes.filter((vote) => vote.activityId === activity.id).slice(0, 4)
          return (
            <Panel key={activity.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{activity.name}</h2>
                  <p className="text-sm text-slate-500">{destination?.name} · {activity.type}</p>
                </div>
                <Tag>{activity.intensity}体力</Tag>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
                <div><p className="text-slate-500">想去</p><p className="font-semibold">{stats.want}</p></div>
                <div><p className="text-slate-500">无所谓</p><p className="font-semibold">{stats.neutral}</p></div>
                <div><p className="text-slate-500">不想去</p><p className="font-semibold">{stats.no}</p></div>
                <div><p className="text-slate-500">花费</p><p className="font-semibold">¥{activity.cost}</p></div>
              </div>
              {stats.no >= 3 && <p className="mt-3 rounded-md bg-orange-50 px-3 py-2 text-sm text-orange-800">争议较大，建议作为可选活动而不是必去。</p>}
              <div className="mt-4 space-y-2">
                {votes.map((vote) => {
                  const member = plan.members.find((item) => item.id === vote.memberId)
                  return (
                    <div key={`${vote.memberId}-${vote.activityId}`} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                      <span>{member?.name}</span>
                      <select value={vote.choice} onChange={(event) => updateChoice(vote, event.target.value as ActivityVote['choice'])} className="rounded-md border border-slate-200 bg-white px-2 py-1">
                        <option>想去</option>
                        <option>无所谓</option>
                        <option>不想去</option>
                      </select>
                    </div>
                  )
                })}
              </div>
            </Panel>
          )
        })}
      </div>
    </>
  )
}
