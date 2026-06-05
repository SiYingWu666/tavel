import { WandSparkles } from 'lucide-react'
import type { TripPlan } from '../../types'
import { generateItinerary, analyzeDay } from '../../utils/itineraryEngine'
import { Panel, SectionHeader, Tag } from '../Layout/UI'

const slotLabels = { morning: '上午', afternoon: '下午', evening: '晚上' } as const

export function ItineraryPage({ plan, setPlan }: { plan: TripPlan; setPlan: React.Dispatch<React.SetStateAction<TripPlan>> }) {
  return (
    <>
      <SectionHeader
        title="行程安排"
        desc="按 Day 1 / Day 2 / Day 3 管理上午、下午、晚上，并检测强度、预算和自由时间。"
        action={
          <div className="flex flex-wrap gap-2">
            {(['轻松版', '特种兵版', '随机版'] as const).map((mode) => <button key={mode} className="btn-primary" onClick={() => setPlan((current) => ({ ...current, itinerary: generateItinerary(current.activities, 3, mode) }))}><WandSparkles size={16} /> {mode}</button>)}
          </div>
        }
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {plan.itinerary.map((day) => {
          const analysis = analyzeDay(day, plan.activities)
          return (
            <Panel key={day.id}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Day {day.dayIndex}</h2>
                <Tag>{analysis.intensity}强度</Tag>
              </div>
              {(['morning', 'afternoon', 'evening'] as const).map((slot) => (
                <div key={slot} className="mb-3 rounded-lg bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-semibold text-slate-500">{slotLabels[slot]}</p>
                  {(day[slot].length ? day[slot] : ['']).map((activityId, index) => {
                    const activity = plan.activities.find((item) => item.id === activityId)
                    return <p key={`${slot}-${index}`} className="text-sm text-slate-700">{activity?.name || '自由活动 / 休整'}</p>
                  })}
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div><p className="text-slate-500">预算</p><p className="font-semibold">¥{analysis.totalCost}</p></div>
                <div><p className="text-slate-500">耗时</p><p className="font-semibold">{analysis.totalHours}h</p></div>
                <div><p className="text-slate-500">自由</p><p className="font-semibold">{analysis.freeTime}h</p></div>
              </div>
              <div className="mt-3 space-y-2">{analysis.alerts.map((alert) => <p key={alert} className="rounded-md bg-orange-50 px-3 py-2 text-sm text-orange-800">{alert}</p>)}</div>
            </Panel>
          )
        })}
      </div>
    </>
  )
}
