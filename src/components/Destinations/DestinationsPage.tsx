import { Plus, Trash2 } from 'lucide-react'
import type { TripPlan } from '../../types'
import { Panel, SectionHeader, Tag } from '../Layout/UI'

export function DestinationsPage({ plan, setPlan }: { plan: TripPlan; setPlan: React.Dispatch<React.SetStateAction<TripPlan>> }) {
  const addDestination = () => {
    setPlan((current) => ({
      ...current,
      destinations: [
        ...current.destinations,
        {
          ...current.destinations[0],
          id: `d-${Date.now()}`,
          name: '新的目的地',
          location: '待补充',
          description: '写下这个候选地为什么值得进入八人讨论。',
          budgetPerPerson: 2600,
          inRandomPool: true,
        },
      ],
    }))
  }

  return (
    <>
      <SectionHeader title="目的地候选池" desc="候选地可以加入投票、对比和随机旅行池。" action={<button className="btn-primary" onClick={addDestination}><Plus size={16} /> 添加目的地</button>} />
      <div className="grid gap-4 xl:grid-cols-3">
        {plan.destinations.map((destination) => (
          <Panel key={destination.id}>
            <div className="mb-4 h-24 rounded-lg" style={{ background: `linear-gradient(135deg, ${destination.imageTone}, #ffffff)` }} />
            <input
              value={destination.name}
              onChange={(event) => setPlan((current) => ({ ...current, destinations: current.destinations.map((item) => item.id === destination.id ? { ...item, name: event.target.value } : item) }))}
              className="w-full border-0 bg-transparent text-xl font-semibold outline-none"
            />
            <p className="text-sm text-slate-500">{destination.location}</p>
            <p className="mt-3 min-h-16 text-sm leading-6 text-slate-600">{destination.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">{destination.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div><p className="text-slate-500">人均</p><p className="font-semibold">¥{destination.budgetPerPerson}</p></div>
              <div><p className="text-slate-500">天数</p><p className="font-semibold">{destination.suggestedDays} 天</p></div>
              <div><p className="text-slate-500">交通</p><p className="font-semibold">{destination.trafficDifficulty}/5</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="btn-secondary flex-1" onClick={() => setPlan((current) => ({ ...current, votes: current.votes.map((vote) => vote.destinationId === destination.id ? { ...vote, scores: { ...vote.scores, desire: Math.min(5, vote.scores.desire + 1) } } : vote) }))}>投票 +1</button>
              <button className="icon-btn" onClick={() => setPlan((current) => ({ ...current, destinations: current.destinations.filter((item) => item.id !== destination.id) }))}><Trash2 size={16} /></button>
            </div>
          </Panel>
        ))}
      </div>
    </>
  )
}
