import type { DestinationDecision, Destination, Member, Vote, VoteScore } from '../types'

const avg = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0)

const variance = (values: number[]) => {
  const average = avg(values)
  return avg(values.map((value) => Math.pow(value - average, 2)))
}

const weightedScore = (score: VoteScore, member: Member) => {
  const weighted =
    score.budget * member.weights.budget +
    score.scenery * member.weights.scenery +
    score.food * member.weights.food +
    score.relaxation * member.weights.relaxation +
    score.traffic * member.weights.traffic +
    score.activities * member.weights.activities +
    score.novelty * member.weights.novelty +
    score.desire * 4
  const totalWeight = Object.values(member.weights).reduce((sum, value) => sum + value, 0) + 4
  return (weighted / totalWeight) * 20
}

export function calculateDestinationDecisions(
  destinations: Destination[],
  members: Member[],
  votes: Vote[],
): DestinationDecision[] {
  return destinations
    .map((destination) => {
      const destinationVotes = votes.filter((vote) => vote.destinationId === destination.id)
      const memberScores = destinationVotes.map((vote) => {
        const member = members.find((item) => item.id === vote.memberId)
        return member ? { member, score: weightedScore(vote.scores, member), raw: vote } : undefined
      }).filter(Boolean) as { member: Member; score: number; raw: Vote }[]

      const scores = memberScores.map((item) => item.score)
      const totalScore = Math.round(avg(scores))
      const averageScore = Number((avg(destinationVotes.map((vote) => vote.scores.desire))).toFixed(1))
      const supportCount = destinationVotes.filter((vote) => vote.scores.desire >= 4).length
      const opposeCount = destinationVotes.filter((vote) => vote.scores.desire <= 2).length
      const neutralCount = Math.max(0, members.length - supportCount - opposeCount)
      const controversy = Math.round(Math.min(100, variance(destinationVotes.map((vote) => vote.scores.desire)) * 28))
      const consensus = Math.max(0, Math.min(100, Math.round(100 - controversy - opposeCount * 6 + supportCount * 2)))
      const sortedMembers = [...memberScores].sort((a, b) => b.score - a.score)
      const budgetPressure = members.filter((member) => destination.budgetPerPerson > member.preference.budgetMax).length

      let fairnessHint = '该方案共识度较高，适合作为稳妥选择。'
      if (opposeCount >= 2 && totalScore >= 70) fairnessHint = '该方案虽然总分较高，但存在明显反对者，需要进一步沟通。'
      if (controversy >= 35) fairnessHint = '该方案争议较大，适合喜欢冒险和新鲜感的人，但不一定适合全员。'
      if (budgetPressure >= 3) fairnessHint = '该方案可能造成预算压力，可以考虑压缩住宿或活动成本。'

      const strengths = [
        destination.scores.scenery >= 4 ? '风景吸引力强' : '',
        destination.scores.food >= 4 ? '美食体验突出' : '',
        destination.scores.groupFit >= 4 ? '适合八人团行动' : '',
        destination.scores.relaxation >= 4 ? '节奏相对轻松' : '',
      ].filter(Boolean)

      return {
        destination,
        totalScore,
        averageScore,
        supportCount,
        neutralCount,
        opposeCount,
        controversy,
        consensus,
        bestMembers: sortedMembers.slice(0, 2).map((item) => item.member),
        worstMembers: sortedMembers.slice(-2).map((item) => item.member),
        strengths,
        risks: [...destination.risks, ...(budgetPressure ? [`${budgetPressure} 位成员预算可能吃紧`] : [])],
        fairnessHint,
        recommendation: `${destination.name}的综合分为 ${totalScore}，优势在于${strengths.slice(0, 2).join('、') || '整体均衡'}。${fairnessHint}`,
      }
    })
    .sort((a, b) => b.totalScore - a.totalScore)
}

export function getDecisionProgress(members: Member[], destinations: Destination[], votes: Vote[]) {
  const preferenceProgress = members.filter((member) => member.preferenceSubmitted).length / members.length
  const voteProgress = votes.length / Math.max(1, members.length * Math.min(destinations.length, 8))
  const confirmProgress = members.filter((member) => member.finalConfirmed).length / members.length
  return Math.round((preferenceProgress * 0.35 + voteProgress * 0.45 + confirmProgress * 0.2) * 100)
}
