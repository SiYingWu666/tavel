export type TravelStyle =
  | '自然风光'
  | '城市探索'
  | '美食'
  | '拍照'
  | '休闲'
  | '特种兵'
  | '文化历史'
  | '游乐园'
  | '海边'
  | '雪山'
  | '草原'
  | '小众目的地'
  | '未知探索'

export type MemberRole =
  | '组织者'
  | '预算控制员'
  | '摄影担当'
  | '美食担当'
  | '气氛担当'
  | '路线规划'
  | '体验官'
  | '安全官'

export interface Preference {
  budgetMin: number
  budgetMax: number
  extraForExperience: boolean
  availableDates: string[]
  tripDays: number
  acceptEarlyStart: boolean
  acceptNightTransit: boolean
  travelStyles: TravelStyle[]
  dislikes: string[]
  specialNeeds: string[]
}

export interface VoteWeights {
  budget: number
  scenery: number
  food: number
  relaxation: number
  traffic: number
  activities: number
  novelty: number
}

export interface Member {
  id: string
  name: string
  avatar: string
  role: MemberRole
  preferenceSubmitted: boolean
  finalConfirmed: boolean
  preference: Preference
  weights: VoteWeights
}

export interface DestinationScores {
  traffic: number
  scenery: number
  food: number
  activities: number
  photo: number
  relaxation: number
  novelty: number
  niche: number
  groupFit: number
}

export interface Destination {
  id: string
  name: string
  location: string
  description: string
  imageTone: string
  tags: TravelStyle[]
  budgetPerPerson: number
  suggestedDays: number
  trafficDifficulty: 1 | 2 | 3 | 4 | 5
  scores: DestinationScores
  pros: string[]
  cons: string[]
  risks: string[]
  inRandomPool: boolean
}

export interface VoteScore {
  desire: number
  budget: number
  traffic: number
  scenery: number
  food: number
  activities: number
  relaxation: number
  novelty: number
}

export interface Vote {
  memberId: string
  destinationId: string
  scores: VoteScore
  comment?: string
}

export type ActivityType =
  | '景点'
  | '美食'
  | '娱乐'
  | '购物'
  | '拍照'
  | '户外'
  | '休息'
  | '小众体验'
  | '随机挑战'

export interface Activity {
  id: string
  destinationId: string
  name: string
  type: ActivityType
  cost: number
  durationHours: number
  intensity: '低' | '中' | '高'
  suitablePeople: number
  rating: number
  mustGo: boolean
  randomFriendly: boolean
  pros: string[]
  risks: string[]
}

export type ActivityChoice = '想去' | '无所谓' | '不想去'

export interface ActivityVote {
  memberId: string
  activityId: string
  choice: ActivityChoice
}

export interface ItineraryDay {
  id: string
  dayIndex: number
  morning: string[]
  afternoon: string[]
  evening: string[]
  challengeCard?: string
}

export type BudgetCategory =
  | '往返交通'
  | '市内交通'
  | '住宿'
  | '餐饮'
  | '门票'
  | '活动'
  | '购物'
  | '备用金'
  | '随机活动预算'

export interface BudgetItem {
  id: string
  name: string
  category: BudgetCategory
  amount: number
  splitAll: boolean
  participants: string[]
}

export type RandomTripMode =
  | '完全随机'
  | '半随机'
  | '偏好随机'
  | '反向随机'
  | '神秘目的地'
  | '随机活动'

export interface ChallengeCard {
  id: string
  title: string
  description: string
  intensity: '轻松' | '中等' | '刺激'
}

export interface RandomTripResult {
  id: string
  mode: RandomTripMode
  destinationId: string
  reason: string
  teamFit: string
  risks: string[]
  days: number
  budgetRange: [number, number]
  activities: string[]
  clues: string[]
  challengeCards: ChallengeCard[]
  accepted: boolean
  revealed: boolean
  createdAt: string
}

export interface AIAdviceInput {
  members: Member[]
  destinations: Destination[]
  votes: Vote[]
  activities: Activity[]
  activityVotes: ActivityVote[]
  itinerary: ItineraryDay[]
  budgetItems: BudgetItem[]
  randomResult?: RandomTripResult
}

export interface AIAdvice {
  title: string
  summary: string
  suggestions: string[]
  risks: string[]
  savingOption: string
  excitingOption: string
  relaxedOption: string
  provider: 'local-rules' | 'future-api'
}

export interface BrandSettings {
  appName: string
  groupName: string
  groupSubtitle: string
  groupIconSrc: string
  groupCoverSrc: string
  allowRename: boolean
}

export type TripMemorySource = 'manual' | 'imported' | 'archived-plan'

export interface TripMemory {
  id: string
  title: string
  destination: string
  location: string
  startDate: string
  endDate: string
  coverPhoto: string
  photos: string[]
  members: string[]
  highlights: string[]
  budgetPerPerson: number
  days: number
  tags: string[]
  source: TripMemorySource
  createdAt: string
  linkedDestinationId?: string
}

export interface TripPlan {
  brand: BrandSettings
  groupName: string
  members: Member[]
  destinations: Destination[]
  votes: Vote[]
  activities: Activity[]
  activityVotes: ActivityVote[]
  itinerary: ItineraryDay[]
  budgetItems: BudgetItem[]
  randomResults: RandomTripResult[]
  tripMemories: TripMemory[]
  finalDestinationId?: string
}

export interface DestinationDecision {
  destination: Destination
  totalScore: number
  averageScore: number
  supportCount: number
  neutralCount: number
  opposeCount: number
  controversy: number
  consensus: number
  bestMembers: Member[]
  worstMembers: Member[]
  strengths: string[]
  risks: string[]
  fairnessHint: string
  recommendation: string
}
