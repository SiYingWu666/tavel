import { challengeCards } from '../data/mockData'
import type { Destination, Member, RandomTripMode, RandomTripResult } from '../types'

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

function weightedPick(destinations: Destination[], weights: number[]) {
  const total = weights.reduce((sum, weight) => sum + Math.max(1, weight), 0)
  let cursor = Math.random() * total
  for (let index = 0; index < destinations.length; index += 1) {
    cursor -= Math.max(1, weights[index])
    if (cursor <= 0) return destinations[index]
  }
  return destinations[0]
}

function sharedStyleWeight(destination: Destination, members: Member[]) {
  return members.reduce((sum, member) => {
    const hits = member.preference.travelStyles.filter((style) => destination.tags.includes(style)).length
    const budgetFit = destination.budgetPerPerson <= member.preference.budgetMax ? 1.4 : 0.6
    return sum + hits * budgetFit
  }, 1)
}

export function generateRandomTrip(
  mode: RandomTripMode,
  destinations: Destination[],
  members: Member[],
  lastDestinationId?: string,
): RandomTripResult {
  const pool = destinations.filter((destination) => destination.inRandomPool && destination.id !== lastDestinationId)
  const averageMaxBudget = members.reduce((sum, member) => sum + member.preference.budgetMax, 0) / members.length
  const viable = pool.filter((destination) => destination.budgetPerPerson <= averageMaxBudget + 400 && destination.trafficDifficulty <= 4)
  const relaxedPool = viable.length ? viable : pool

  let destination: Destination
  if (mode === '完全随机' || mode === '神秘目的地' || mode === '随机活动') {
    destination = pick(pool)
  } else if (mode === '半随机') {
    destination = pick(relaxedPool)
  } else if (mode === '反向随机') {
    const reversePool = relaxedPool
      .map((item) => ({ item, weight: Math.max(1, 10 - sharedStyleWeight(item, members) + item.scores.novelty) }))
      .sort((a, b) => b.weight - a.weight)
    destination = weightedPick(reversePool.map((item) => item.item), reversePool.map((item) => item.weight))
  } else {
    destination = weightedPick(relaxedPool, relaxedPool.map((item) => sharedStyleWeight(item, members) + item.scores.groupFit))
  }

  const cards = [...challengeCards].sort(() => Math.random() - 0.5).slice(0, 2)
  const clues = [
    `人均预算：约 ${destination.budgetPerPerson} 元`,
    `关键词：${destination.tags.join('、')}`,
    `交通难度：${'低中高很高超高'[destination.trafficDifficulty - 1] || '中等'}`,
    `适合：${destination.pros.join('、')}`,
  ]

  return {
    id: `rr-${Date.now()}`,
    mode,
    destinationId: destination.id,
    reason:
      mode === '反向随机'
        ? '它不是大家第一眼都会选的方向，但仍在预算和交通可接受范围内，适合制造惊喜。'
        : mode === '完全随机'
          ? '这次把选择权交给系统，保留完整开盲盒体验。'
          : '它在偏好、预算和新鲜感之间取得了不错平衡。',
    teamFit: `${destination.name}适合这个团队，因为它覆盖了${destination.tags.slice(0, 3).join('、')}，同时八人行动友好度为 ${destination.scores.groupFit}/5。`,
    risks: destination.risks,
    days: destination.suggestedDays,
    budgetRange: [destination.budgetPerPerson - 300, destination.budgetPerPerson + 500],
    activities: ['本地特色活动', '全员拍照点', '半天自由活动'],
    clues,
    challengeCards: cards,
    accepted: false,
    revealed: mode !== '神秘目的地',
    createdAt: new Date().toISOString(),
  }
}
