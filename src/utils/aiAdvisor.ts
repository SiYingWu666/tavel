import { calculateBudget } from './budgetEngine'
import { calculateDestinationDecisions } from './decisionEngine'
import { analyzeDay } from './itineraryEngine'
import type { AIAdvice, AIAdviceInput } from '../types'

export type AIAdvisorProvider = (input: AIAdviceInput) => AIAdvice

export const localRuleAdvisor: AIAdvisorProvider = (input) => {
  const decisions = calculateDestinationDecisions(input.destinations, input.members, input.votes)
  const best = decisions[0]
  const budget = calculateBudget(input.budgetItems, input.members)
  const intenseDays = input.itinerary
    .map((day) => analyzeDay(day, input.activities))
    .filter((day) => day.intensity === '高').length
  const lowBudgetMembers = input.members.filter((member) => member.preference.budgetMax < budget.average)

  return {
    title: '本地规则模拟 AI 决策助手',
    provider: 'local-rules',
    summary: `当前最适合的目的地是 ${best.destination.name}，因为它在共识、预算和团队适配度上最平衡。`,
    suggestions: [
      `${best.destination.name} 的共识度为 ${best.consensus}%，建议作为主方案推进。`,
      lowBudgetMembers.length
        ? `${lowBudgetMembers.map((member) => member.name).join('、')} 预算较紧，建议优先压缩住宿或购物预算。`
        : '当前人均预算基本落在大多数成员可接受范围内。',
      intenseDays ? `当前有 ${intenseDays} 天强度偏高，建议保留半天自由活动。` : '行程强度比较友好，可以加入一个轻量随机挑战。',
      input.randomResult ? `随机旅行刚抽到 ${input.destinations.find((item) => item.id === input.randomResult?.destinationId)?.name}，可作为备选惊喜方案。` : '如果团队纠结，可以使用半随机模式保留未知感。'
    ],
    risks: [best.fairnessHint, ...budget.risks].slice(0, 4),
    savingOption: '想省钱：优先选择重庆、威海或西安，减少高价景点和购物预算。',
    excitingOption: '想刺激：选择新疆、长白山或反向随机模式，但要提前确认交通和体力。',
    relaxedOption: '想轻松：选择厦门、威海或成都，把每天活动控制在 2-3 个。',
  }
}

export const remoteAIAdvisorPlaceholder: AIAdvisorProvider = () => ({
  title: '未来 API Provider',
  provider: 'future-api',
  summary: '这里预留给未来真实 AI API 接入。',
  suggestions: ['保持 AIAdviceInput / AIAdvice 结构不变即可替换 provider。'],
  risks: [],
  savingOption: '',
  excitingOption: '',
  relaxedOption: '',
})

export const generateAIAdvice = localRuleAdvisor
