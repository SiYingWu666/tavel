import type {
  Activity,
  ActivityVote,
  BudgetItem,
  ChallengeCard,
  Destination,
  ItineraryDay,
  Member,
  BrandSettings,
  TripPlan,
  TripMemory,
  TravelStyle,
  Vote,
} from '../types'

const styles: TravelStyle[] = ['自然风光', '美食', '拍照', '休闲', '未知探索']

export const challengeCards: ChallengeCard[] = [
  { id: 'cc-1', title: '八人同框', description: '今天必须拍一张全员合照，并让路人帮忙取景。', intensity: '轻松' },
  { id: 'cc-2', title: '本地味道', description: '每个人推荐一道当地食物，晚饭前投票只选前三名。', intensity: '中等' },
  { id: 'cc-3', title: '不进连锁店', description: '今天的饮料、零食和正餐都不能选择全国连锁品牌。', intensity: '中等' },
  { id: 'cc-4', title: '50 元纪念品', description: '每人用 50 元以内买一件能代表目的地的纪念品。', intensity: '轻松' },
  { id: 'cc-5', title: '反向路线', description: '选一个平时不会主动去的小众地点，至少停留 40 分钟。', intensity: '刺激' },
]

export const members: Member[] = [
  ['m1', '阿宁', '组织者', 'AN', 1800, 3600, ['自然风光', '拍照', '休闲']],
  ['m2', '小鱼', '预算控制员', 'XY', 1200, 2600, ['美食', '城市探索', '休闲']],
  ['m3', '林一', '摄影担当', 'LY', 2000, 4200, ['自然风光', '拍照', '雪山']],
  ['m4', '可乐', '美食担当', 'KL', 1600, 3300, ['美食', '城市探索', '文化历史']],
  ['m5', '七七', '气氛担当', 'QQ', 1500, 3200, ['游乐园', '海边', '未知探索']],
  ['m6', '周周', '路线规划', 'ZZ', 2200, 4500, ['草原', '自然风光', '小众目的地']],
  ['m7', '眠眠', '体验官', 'MM', 1400, 2800, ['休闲', '美食', '拍照']],
  ['m8', '小满', '安全官', 'XM', 1700, 3500, ['自然风光', '文化历史', '未知探索']],
].map(([id, name, role, avatar, min, max, memberStyles], index) => ({
  id: id as string,
  name: name as string,
  role: role as Member['role'],
  avatar: avatar as string,
  preferenceSubmitted: index !== 6,
  finalConfirmed: index < 4,
  preference: {
    budgetMin: min as number,
    budgetMax: max as number,
    extraForExperience: index % 3 === 0,
    availableDates: ['7月12日-7月15日', '7月19日-7月22日'],
    tripDays: index % 2 === 0 ? 4 : 3,
    acceptEarlyStart: index !== 6,
    acceptNightTransit: index < 5,
    travelStyles: memberStyles as TravelStyle[],
    dislikes: index % 2 === 0 ? ['太贵', '转车太多'] : ['太累', '早起'],
    specialNeeds: index === 6 ? ['体力较弱', '想省钱'] : index === 2 ? ['想拍照'] : ['想体验新鲜感'],
  },
  weights: {
    budget: index === 1 || index === 6 ? 5 : 3,
    scenery: index === 2 || index === 5 ? 5 : 4,
    food: index === 3 ? 5 : 3,
    relaxation: index === 6 ? 5 : 3,
    traffic: index === 7 ? 5 : 3,
    activities: index === 4 ? 5 : 4,
    novelty: index === 5 ? 5 : 3,
  },
}))

export const destinations: Destination[] = [
  ['d-qinghai', '青海', '青海 / 西北', '湖泊、盐湖、公路和辽阔天空，很适合八人拍照与自然风光路线。', ['自然风光', '拍照', '小众目的地'], 2800, 4, 3, '#d8f3ff'],
  ['d-changbai', '长白山', '吉林 / 延边', '雪山、天池、温泉和森林，体验感强但交通和天气不确定。', ['雪山', '自然风光', '休闲'], 3300, 4, 4, '#e7f0ff'],
  ['d-xinjiang', '新疆', '新疆', '超长线自然风光天花板，适合想要震撼体验的小队。', ['自然风光', '草原', '拍照'], 4800, 6, 5, '#fff2c9'],
  ['d-neimeng', '内蒙古', '呼伦贝尔 / 赤峰', '草原、骑马、落日和篝火，预算适中但路途较长。', ['草原', '自然风光', '未知探索'], 3000, 5, 4, '#e8f7d2'],
  ['d-chongqing', '重庆', '重庆', '美食、夜景和城市探索强，预算友好但坡多且人多。', ['美食', '城市探索', '拍照'], 2200, 3, 2, '#ffe0d8'],
  ['d-xiamen', '厦门', '福建 / 厦门', '海边、骑行、咖啡和轻松节奏，适合第一次八人旅行。', ['海边', '休闲', '美食'], 2500, 3, 2, '#dff7f4'],
  ['d-yunnan', '云南', '大理 / 丽江', '古城、雪山、湖泊和慢生活，选择多但容易路线发散。', ['自然风光', '文化历史', '休闲'], 3200, 5, 3, '#f2e7ff'],
  ['d-zhangjiajie', '张家界', '湖南 / 张家界', '奇峰山景和户外体验突出，体力要求偏高。', ['自然风光', '拍照', '特种兵'], 2600, 4, 3, '#e2f7e5'],
  ['d-chengdu', '成都', '四川 / 成都', '美食、熊猫、周边短线都方便，综合稳定。', ['美食', '城市探索', '休闲'], 2300, 3, 2, '#fff0d6'],
  ['d-guizhou', '贵州', '贵阳 / 黔东南', '山水、小众村寨和酸汤美食，性价比高。', ['小众目的地', '自然风光', '美食'], 2400, 4, 3, '#e4f5dc'],
  ['d-xian', '西安', '陕西 / 西安', '历史文化与夜市兼具，交通便利，强度可控。', ['文化历史', '美食', '城市探索'], 2100, 3, 1, '#f7ead8'],
  ['d-weihai', '威海', '山东 / 威海', '海边、骑行和看日出，轻松度高，适合预算友好路线。', ['海边', '休闲', '拍照'], 2000, 3, 2, '#dcefff'],
].map(([id, name, location, description, tags, budget, days, traffic, imageTone], index) => ({
  id: id as string,
  name: name as string,
  location: location as string,
  description: description as string,
  imageTone: imageTone as string,
  tags: tags as TravelStyle[],
  budgetPerPerson: budget as number,
  suggestedDays: days as number,
  trafficDifficulty: traffic as Destination['trafficDifficulty'],
  scores: {
    traffic: 6 - (traffic as number),
    scenery: [5, 5, 5, 5, 3, 4, 5, 5, 3, 4, 3, 4][index],
    food: [3, 3, 4, 3, 5, 4, 4, 3, 5, 4, 5, 4][index],
    activities: [4, 4, 5, 4, 5, 4, 5, 4, 4, 4, 4, 3][index],
    photo: [5, 5, 5, 5, 4, 4, 5, 5, 4, 4, 4, 4][index],
    relaxation: [3, 3, 2, 3, 3, 5, 4, 2, 4, 3, 4, 5][index],
    novelty: [4, 4, 5, 4, 3, 3, 4, 4, 3, 5, 3, 3][index],
    niche: [4, 3, 4, 4, 2, 2, 3, 3, 2, 5, 2, 3][index],
    groupFit: [5, 4, 3, 4, 4, 5, 4, 3, 5, 4, 4, 5][index],
  },
  pros: ['视觉记忆点强', '适合多人拍照', '活动组合丰富'].slice(0, 2 + (index % 2)),
  cons: (budget as number) > 3500 ? ['预算压力较高', '路程较长'] : ['旺季人流较多', '需要提前订住宿'],
  risks: (traffic as number) >= 4 ? ['交通衔接复杂', '部分成员可能疲惫'] : ['热门点位排队', '天气影响体验'],
  inRandomPool: index !== 2,
}))

const scoreFor = (memberIndex: number, destIndex: number) => {
  const base = [4, 3, 2, 3, 5, 4, 3, 3, 4, 4, 4, 4][destIndex]
  const wobble = ((memberIndex + destIndex) % 3) - 1
  return Math.max(1, Math.min(5, base + wobble))
}

export const votes: Vote[] = members.flatMap((member, memberIndex) =>
  destinations.slice(0, 8).map((destination, destIndex) => {
    const desire = scoreFor(memberIndex, destIndex)
    return {
      memberId: member.id,
      destinationId: destination.id,
      scores: {
        desire,
        budget: destination.budgetPerPerson <= member.preference.budgetMax ? 4 : 2,
        traffic: 6 - destination.trafficDifficulty,
        scenery: destination.scores.scenery,
        food: destination.scores.food,
        activities: destination.scores.activities,
        relaxation: destination.scores.relaxation,
        novelty: destination.scores.novelty,
      },
      comment: desire >= 4 ? '愿意认真考虑' : desire <= 2 ? '担心不太适合我' : '可以再讨论',
    }
  }),
)

export const activities: Activity[] = destinations.slice(0, 6).flatMap((destination, index) => [
  {
    id: `a-${destination.id}-1`,
    destinationId: destination.id,
    name: `${destination.name}代表性景点半日游`,
    type: '景点',
    cost: 180 + index * 20,
    durationHours: 4,
    intensity: index % 3 === 0 ? '高' : '中',
    suitablePeople: 8,
    rating: 4.6,
    mustGo: true,
    randomFriendly: true,
    pros: ['记忆点强', '适合全员参与'],
    risks: ['旺季需要预约'],
  },
  {
    id: `a-${destination.id}-2`,
    destinationId: destination.id,
    name: `${destination.name}本地美食夜游`,
    type: '美食',
    cost: 120 + index * 10,
    durationHours: 3,
    intensity: '低',
    suitablePeople: 8,
    rating: 4.8,
    mustGo: index % 2 === 0,
    randomFriendly: true,
    pros: ['预算友好', '聊天氛围好'],
    risks: ['口味可能分化'],
  },
  {
    id: `a-${destination.id}-3`,
    destinationId: destination.id,
    name: `${destination.name}小众挑战卡路线`,
    type: '随机挑战',
    cost: 80 + index * 15,
    durationHours: 2,
    intensity: '中',
    suitablePeople: 6,
    rating: 4.2,
    mustGo: false,
    randomFriendly: true,
    pros: ['新鲜感强', '适合盲盒玩法'],
    risks: ['不适合所有成员'],
  },
])

export const activityVotes: ActivityVote[] = activities.flatMap((activity, index) =>
  members.map((member, memberIndex) => ({
    memberId: member.id,
    activityId: activity.id,
    choice: ((index + memberIndex) % 5 === 0 ? '不想去' : (index + memberIndex) % 2 === 0 ? '想去' : '无所谓') as ActivityVote['choice'],
  })),
)

export const itinerary: ItineraryDay[] = [
  { id: 'day-1', dayIndex: 1, morning: [], afternoon: ['a-d-qinghai-2'], evening: ['a-d-qinghai-3'], challengeCard: challengeCards[0].id },
  { id: 'day-2', dayIndex: 2, morning: ['a-d-qinghai-1'], afternoon: ['a-d-qinghai-3'], evening: ['a-d-qinghai-2'], challengeCard: challengeCards[1].id },
  { id: 'day-3', dayIndex: 3, morning: ['a-d-xiamen-1'], afternoon: [], evening: ['a-d-xiamen-2'], challengeCard: challengeCards[3].id },
]

export const budgetItems: BudgetItem[] = [
  { id: 'b-1', name: '往返交通预估', category: '往返交通', amount: 7600, splitAll: true, participants: members.map((m) => m.id) },
  { id: 'b-2', name: '三晚住宿', category: '住宿', amount: 4800, splitAll: true, participants: members.map((m) => m.id) },
  { id: 'b-3', name: '当地餐饮', category: '餐饮', amount: 3600, splitAll: true, participants: members.map((m) => m.id) },
  { id: 'b-4', name: '景点门票', category: '门票', amount: 2400, splitAll: true, participants: members.map((m) => m.id) },
  { id: 'b-5', name: '随机挑战基金', category: '随机活动预算', amount: 800, splitAll: false, participants: members.slice(0, 5).map((m) => m.id) },
]

export const defaultBrandSettings: BrandSettings = {
  appName: 'TripVote',
  groupName: '五人帮 CLUB·5',
  groupSubtitle: '',
  groupIconSrc: '/brand/club5-icon.png',
  groupCoverSrc: '/brand/club5-cover.jpg',
  allowRename: true,
}

export const tripMemories: TripMemory[] = [
  {
    id: 'memory-chongqing-2025',
    title: '山城夜游和火锅局',
    destination: '重庆',
    location: '重庆 / 渝中',
    startDate: '2025-07-12',
    endDate: '2025-07-15',
    coverPhoto: '/brand/club5-cover.jpg',
    photos: ['/brand/club5-cover.jpg'],
    members: members.slice(0, 8).map((member) => member.name),
    highlights: ['洪崖洞夜景', '八人火锅局', '临时抽签决定晚饭'],
    budgetPerPerson: 2300,
    days: 4,
    tags: ['美食', '城市探索', '夜景'],
    source: 'manual',
    createdAt: '2025-07-16T12:00:00.000Z',
    linkedDestinationId: 'd-chongqing',
  },
  {
    id: 'memory-xiamen-2024',
    title: '海边骑行和半天发呆',
    destination: '厦门',
    location: '福建 / 厦门',
    startDate: '2024-08-03',
    endDate: '2024-08-06',
    coverPhoto: '/brand/club5-cover.jpg',
    photos: ['/brand/club5-cover.jpg'],
    members: members.slice(0, 6).map((member) => member.name),
    highlights: ['环岛路骑行', '沙坡尾拍照', '临时取消早起计划'],
    budgetPerPerson: 2100,
    days: 4,
    tags: ['海边', '休闲', '拍照'],
    source: 'manual',
    createdAt: '2024-08-07T12:00:00.000Z',
    linkedDestinationId: 'd-xiamen',
  },
]

export const initialTripPlan: TripPlan = {
  brand: defaultBrandSettings,
  groupName: '暑假八人旅行计划',
  members,
  destinations,
  votes,
  activities,
  activityVotes,
  itinerary,
  budgetItems,
  randomResults: [],
  tripMemories,
  finalDestinationId: 'd-qinghai',
}

export const defaultStyles = styles
