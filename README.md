# TripVote

八人旅行共识决策助手。当前版本是本地单机演示版，使用 mock 数据和 localStorage，不需要后端，也不会调用真实 AI API。

## 启动

```bash
npm install
npm run dev
```

构建检查：

```bash
npm run build
```

## 核心功能

- Dashboard：展示八人团队状态、偏好提交、候选目的地、推荐目的地、预算、人均、共识度和决策进度。
- 成员偏好：默认 8 名成员，可编辑昵称、预算、偏好提交状态。
- 目的地候选池：内置青海、长白山、新疆、内蒙古、重庆、厦门、云南、张家界、成都、贵州、西安、威海等 mock 目的地。
- 投票排名：根据成员评分和权重计算综合分、支持/反对/中立人数、争议度、共识度和公平性提示。
- 随机旅行：支持完全随机、半随机、偏好随机、反向随机、神秘目的地、随机活动和挑战卡。
- 活动选择：成员可对活动选择想去、无所谓、不想去，并提示争议活动。
- 行程安排：支持轻松版、特种兵版、随机版行程生成，并检测强度、耗时和预算风险。
- 预算分摊：支持预算项编辑、分类统计、AA 分摊、部分成员参与分摊和个人超预算提示。
- 最终方案：生成适合发到微信群的旅行方案文本，并支持复制。
- 设置 / 数据管理：支持重置 Demo、清空 localStorage、导出 JSON、导入 JSON。

## AI 决策助手

当前 AI 助手不接真实 API，不需要 API Key，也不会发起网络请求。

实现位置：

- `src/utils/aiAdvisor.ts`
- 当前 provider：`localRuleAdvisor`
- 未来预留 provider：`remoteAIAdvisorPlaceholder`

未来如果要接真实 AI API，建议保持 `AIAdviceInput` 和 `AIAdvice` 类型不变，只在 provider 层替换实现。页面组件继续调用 `generateAIAdvice`，避免把 API 逻辑散落到 UI 层。

## 代码结构

```text
src/
  components/
    Layout/
    Dashboard/
    Members/
    Destinations/
    Voting/
    RandomTrip/
    Activities/
    Itinerary/
    Budget/
    FinalPlan/
    Advisor/
    Settings/
  data/mockData.ts
  types/index.ts
  utils/
    decisionEngine.ts
    randomTripEngine.ts
    budgetEngine.ts
    itineraryEngine.ts
    aiAdvisor.ts
  hooks/useTripStore.ts
  App.tsx
  main.tsx
```

## 未来多人在线版设计

当前版本通过 `src/hooks/useTripStore.ts` 使用 localStorage。未来接 Supabase / Firebase / 自建后端时，建议保留 `TripPlan` 数据模型，把 `useTripStore` 替换为远程数据源，并增加登录、团队邀请码、成员权限、实时投票和最终确认。

建议数据库表：

1. `users`
   - `id`
   - `name`
   - `avatar`
   - `email`

2. `groups`
   - `id`
   - `name`
   - `invite_code`
   - `owner_id`
   - `created_at`

3. `group_members`
   - `id`
   - `group_id`
   - `user_id`
   - `role`
   - `status`

4. `preferences`
   - `id`
   - `group_id`
   - `user_id`
   - `budget_min`
   - `budget_max`
   - `available_dates`
   - `travel_styles`
   - `dislikes`
   - `special_needs`

5. `destinations`
   - `id`
   - `group_id`
   - `name`
   - `location`
   - `description`
   - `budget`
   - `tags`
   - `scores`

6. `destination_votes`
   - `id`
   - `destination_id`
   - `user_id`
   - `scores`
   - `weights`
   - `comment`

7. `activities`
   - `id`
   - `destination_id`
   - `name`
   - `type`
   - `cost`
   - `duration`
   - `intensity`

8. `activity_votes`
   - `id`
   - `activity_id`
   - `user_id`
   - `choice`

9. `itinerary_days`
   - `id`
   - `group_id`
   - `day_index`
   - `morning`
   - `afternoon`
   - `evening`

10. `budget_items`
    - `id`
    - `group_id`
    - `name`
    - `category`
    - `amount`
    - `participants`

11. `random_results`
    - `id`
    - `group_id`
    - `mode`
    - `destination_id`
    - `clues`
    - `challenge_cards`
    - `accepted`
