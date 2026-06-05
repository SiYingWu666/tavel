import type { ComponentType } from 'react'
import {
  BadgeCheck,
  Bot,
  CalendarDays,
  Compass,
  Gauge,
  Image,
  Map,
  MapPinned,
  PiggyBank,
  Settings,
  Shuffle,
  Users,
  Vote,
} from 'lucide-react'
import type { BrandSettings } from '../../types'

export type AppSection =
  | 'dashboard'
  | 'members'
  | 'destinations'
  | 'voting'
  | 'random'
  | 'activities'
  | 'itinerary'
  | 'budget'
  | 'memories'
  | 'final'
  | 'settings'

const navItems: { id: AppSection; label: string; icon: ComponentType<{ size?: number }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'members', label: '成员偏好', icon: Users },
  { id: 'destinations', label: '目的地', icon: MapPinned },
  { id: 'voting', label: '投票排名', icon: Vote },
  { id: 'random', label: '随机旅行', icon: Shuffle },
  { id: 'activities', label: '活动', icon: Compass },
  { id: 'itinerary', label: '行程', icon: CalendarDays },
  { id: 'budget', label: '预算', icon: PiggyBank },
  { id: 'memories', label: '旅行记录', icon: Image },
  { id: 'final', label: '最终方案', icon: BadgeCheck },
  { id: 'settings', label: '设置', icon: Settings },
]

interface AppShellProps {
  active: AppSection
  brand: BrandSettings
  onNavigate: (section: AppSection) => void
  children: React.ReactNode
}

export function AppShell({ active, brand, onNavigate, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f6fbf8] text-slate-950">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(251,146,60,0.16),transparent_26%),linear-gradient(135deg,#f8fffc,#fffaf3_46%,#f7fbff)]" />
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/70 bg-white/82 px-5 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-white">
            {brand.groupIconSrc ? <img src={brand.groupIconSrc} alt="" className="h-full w-full object-cover" /> : <Map size={22} />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{brand.appName || 'TripVote'}</p>
            <p className="truncate text-xs text-slate-500">{brand.groupName || '五人帮 CLUB·5'}</p>
            {brand.groupSubtitle && <p className="truncate text-xs text-slate-400">{brand.groupSubtitle}</p>}
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const selected = active === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                  selected ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/10' : 'text-slate-600 hover:bg-teal-50 hover:text-slate-950'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-8 rounded-lg border border-teal-100 bg-teal-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-950">
            <Bot size={16} />
            AI 决策助手
          </div>
          <p className="text-xs leading-5 text-teal-800">当前使用本地规则模拟，不调用 API；以后可替换 provider 接入真实模型。</p>
        </div>
      </aside>
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-950 text-white">
              {brand.groupIconSrc ? <img src={brand.groupIconSrc} alt="" className="h-full w-full object-cover" /> : <Map size={18} />}
            </span>
            <span className="truncate">{brand.groupName || '五人帮 CLUB·5'}</span>
          </div>
          <span className="shrink-0 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-900">本地 Demo</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${active === item.id ? 'bg-slate-950 text-white' : 'bg-white text-slate-600'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>
      <main className="px-4 py-5 lg:ml-72 lg:px-8 lg:py-8">{children}</main>
    </div>
  )
}
