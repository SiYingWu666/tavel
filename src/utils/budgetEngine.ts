import type { BudgetItem, Member } from '../types'

export function calculateBudget(items: BudgetItem[], members: Member[]) {
  const total = items.reduce((sum, item) => sum + item.amount, 0)
  const perMember: Record<string, number> = Object.fromEntries(members.map((member) => [member.id, 0]))

  items.forEach((item) => {
    const participants = item.splitAll ? members.map((member) => member.id) : item.participants
    const share = item.amount / Math.max(1, participants.length)
    participants.forEach((memberId) => {
      perMember[memberId] = (perMember[memberId] || 0) + share
    })
  })

  const categoryTotals = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount
    return acc
  }, {})

  return {
    total,
    average: Math.round(total / Math.max(1, members.length)),
    perMember,
    categoryTotals,
    risks: members
      .filter((member) => (perMember[member.id] || 0) > member.preference.budgetMax)
      .map((member) => `${member.name} 的预算上限为 ${member.preference.budgetMax} 元，当前分摊可能超出。`),
  }
}
