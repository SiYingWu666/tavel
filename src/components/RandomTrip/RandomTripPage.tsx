import { Lock, RefreshCcw, Sparkles } from 'lucide-react'
import type { RandomTripMode, TripPlan } from '../../types'
import { generateRandomTrip } from '../../utils/randomTripEngine'
import { Panel, SectionHeader, Tag } from '../Layout/UI'

const modes: RandomTripMode[] = ['完全随机', '半随机', '偏好随机', '反向随机', '神秘目的地', '随机活动']

export function RandomTripPage({ plan, setPlan }: { plan: TripPlan; setPlan: React.Dispatch<React.SetStateAction<TripPlan>> }) {
  const latest = plan.randomResults[0]
  const run = (mode: RandomTripMode) => {
    const next = generateRandomTrip(mode, plan.destinations, plan.members, latest?.destinationId)
    setPlan((current) => ({ ...current, randomResults: [next, ...current.randomResults].slice(0, 8) }))
  }
  const destination = latest ? plan.destinations.find((item) => item.id === latest.destinationId) : undefined

  return (
    <>
      <SectionHeader title="随机旅行 / 未知旅行" desc="把选择权交给系统：支持盲盒、半随机、偏好随机、反向惊喜和挑战卡。" />
      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Panel>
          <h2 className="font-semibold">随机模式</h2>
          <div className="mt-4 grid gap-2">
            {modes.map((mode) => <button key={mode} onClick={() => run(mode)} className="btn-secondary justify-between"><span>{mode}</span><Sparkles size={15} /></button>)}
          </div>
        </Panel>
        <Panel className="overflow-hidden !bg-slate-950 text-white">
          {latest && destination ? (
            <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-teal-200">{latest.mode}</p>
                  <h2 className="text-3xl font-semibold">{latest.revealed ? destination.name : '神秘目的地'}</h2>
                </div>
                <button className="btn-light" onClick={() => setPlan((current) => ({ ...current, randomResults: current.randomResults.map((item) => item.id === latest.id ? { ...item, revealed: true } : item) }))}><Lock size={16} /> 揭晓</button>
              </div>
              <p className="text-sm leading-6 text-slate-200">{latest.reason}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{latest.teamFit}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-white/10 p-4"><p className="text-xs text-slate-300">预算范围</p><p className="text-xl font-semibold">¥{latest.budgetRange[0]} - ¥{latest.budgetRange[1]}</p></div>
                <div className="rounded-lg bg-white/10 p-4"><p className="text-xs text-slate-300">建议天数</p><p className="text-xl font-semibold">{latest.days} 天</p></div>
              </div>
              <div className="mt-5">
                <p className="mb-2 text-sm font-semibold">线索</p>
                <div className="flex flex-wrap gap-2">{latest.clues.map((clue) => <span key={clue} className="rounded-md bg-white/10 px-2 py-1 text-xs text-slate-100">{clue}</span>)}</div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {latest.challengeCards.map((card) => <div key={card.id} className="rounded-lg border border-white/10 bg-white/10 p-3"><Tag>{card.intensity}</Tag><p className="mt-2 font-semibold">{card.title}</p><p className="mt-1 text-sm text-slate-300">{card.description}</p></div>)}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="btn-light" onClick={() => run(latest.mode)}><RefreshCcw size={16} /> 重新随机</button>
                <button className="btn-light" onClick={() => setPlan((current) => ({ ...current, finalDestinationId: destination.id }))}>加入最终方案</button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-96 flex-col items-center justify-center text-center">
              <Sparkles size={44} className="text-teal-200" />
              <h2 className="mt-4 text-2xl font-semibold">还没有抽取结果</h2>
              <p className="mt-2 text-sm text-slate-300">选择一种模式，开始一次真正可运行的旅行盲盒。</p>
            </div>
          )}
        </Panel>
      </div>
    </>
  )
}
