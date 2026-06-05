import type { Activity, ItineraryDay } from '../types'

const slots: Array<keyof Pick<ItineraryDay, 'morning' | 'afternoon' | 'evening'>> = ['morning', 'afternoon', 'evening']

export function analyzeDay(day: ItineraryDay, activities: Activity[]) {
  const ids = [...day.morning, ...day.afternoon, ...day.evening]
  const dayActivities = activities.filter((activity) => ids.includes(activity.id))
  const totalCost = dayActivities.reduce((sum, activity) => sum + activity.cost, 0)
  const totalHours = dayActivities.reduce((sum, activity) => sum + activity.durationHours, 0)
  const highIntensityCount = dayActivities.filter((activity) => activity.intensity === '高').length
  const alerts = [
    totalHours > 9 ? '行程过紧，可能影响体验。' : '',
    highIntensityCount >= 2 ? '连续高强度安排，部分成员可能吃不消。' : '',
    totalCost > 900 ? '当天花费偏高，可以考虑替换低成本活动。' : '',
  ].filter(Boolean)

  return {
    activities: dayActivities,
    totalCost,
    totalHours,
    intensity: highIntensityCount >= 2 ? '高' : totalHours >= 7 ? '中' : '低',
    trafficPressure: totalHours >= 8 ? '高' : '中',
    freeTime: Math.max(0, 10 - totalHours),
    alerts,
  }
}

export function generateItinerary(activities: Activity[], days = 3, mode: '轻松版' | '特种兵版' | '随机版' = '轻松版'): ItineraryDay[] {
  const sorted = [...activities].sort((a, b) => {
    if (mode === '特种兵版') return b.rating + b.durationHours - (a.rating + a.durationHours)
    if (mode === '随机版') return Math.random() - 0.5
    return (a.intensity === '低' ? -1 : 1) - (b.intensity === '低' ? -1 : 1)
  })

  return Array.from({ length: days }, (_, index) => {
    const day: ItineraryDay = { id: `day-gen-${index + 1}`, dayIndex: index + 1, morning: [], afternoon: [], evening: [] }
    slots.forEach((slot, slotIndex) => {
      const activity = sorted[index * slots.length + slotIndex]
      if (activity) day[slot] = [activity.id]
    })
    return day
  })
}
