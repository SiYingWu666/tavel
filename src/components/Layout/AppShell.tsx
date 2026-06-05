import { useEffect, useMemo, useState, type ComponentType } from 'react'
import {
  BadgeCheck,
  Bot,
  CalendarDays,
  Compass,
  Download,
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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const navItems: { id: AppSection; label: string; shortLabel: string; icon: ComponentType<{ size?: number }> }[] = [
  { id: 'dashboard', label: 'Dashboard', shortLabel: '首页', icon: Gauge },
  { id: 'members', label: '成员偏好', shortLabel: '成员', icon: Users },
  { id: 'destinations', label: '目的地', shortLabel: '目的地', icon: MapPinned },
  { id: 'voting', label: '投票排名', shortLabel: '投票', icon: Vote },
  { id: 'random', label: '随机旅行', shortLabel: '随机', icon: Shuffle },
  { id: 'activities', label: '活动', shortLabel: '活动', icon: Compass },
  { id: 'itinerary', label: '行程', shortLabel: '行程', icon: CalendarDays },
  { id: 'budget', label: '预算', shortLabel: '预算', icon: PiggyBank },
  { id: 'memories', label: '旅行记录', shortLabel: '记录', icon: Image },
  { id: 'final', label: '最终方案', shortLabel: '方案', icon: BadgeCheck },
  { id: 'settings', label: '设置', shortLabel: '设置', icon: Settings },
]

interface AppShellProps {
  active: AppSection
  brand: BrandSettings
  onNavigate: (section: AppSection) => void
  children: React.ReactNode
}

function getStandaloneMode() {
  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || Boolean(navigatorWithStandalone.standalone)
}

export function AppShell({ active, brand, onNavigate, children }: AppShellProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(getStandaloneMode)
  const activeItem = useMemo(() => navItems.find((item) => item.id === active), [active])

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const onAppInstalled = () => setIsStandalone(true)
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onAppInstalled)
    }
  }, [])

  const installApp = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

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
        <div className="mt-8 space-y-3">
          {!isStandalone && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
                <Download size={16} />
                手机直接使用
              </div>
              <p className="text-xs leading-5 text-slate-500">已支持 PWA 安装。手机浏览器打开后可添加到主屏幕。</p>
              {installPrompt && <button className="btn-primary mt-3 w-full" onClick={installApp}>安装到设备</button>}
            </div>
          )}
          <div className="rounded-lg border border-teal-100 bg-teal-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-950">
              <Bot size={16} />
              AI 决策助手
            </div>
            <p className="text-xs leading-5 text-teal-800">当前使用本地规则模拟，不调用 API；以后可替换 provider 接入真实模型。</p>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/88 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 font-semibold">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-950 text-white">
              {brand.groupIconSrc ? <img src={brand.groupIconSrc} alt="" className="h-full w-full object-cover" /> : <Map size={18} />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm">{brand.groupName || '五人帮 CLUB·5'}</span>
              <span className="block truncate text-xs font-medium text-slate-500">{activeItem?.label ?? 'TripVote'}</span>
            </span>
          </div>
          {!isStandalone && installPrompt ? (
            <button className="shrink-0 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white" onClick={installApp}>
              安装
            </button>
          ) : (
            <span className="shrink-0 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-900">PWA</span>
          )}
        </div>
      </header>

      <main className="px-4 py-5 pb-28 lg:ml-72 lg:px-8 lg:py-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/80 bg-white/92 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-[0_-16px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:hidden">
        <div className="flex gap-2 overflow-x-auto px-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const selected = active === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`flex min-h-14 min-w-[68px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold transition ${
                  selected ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/12' : 'bg-slate-50 text-slate-600'
                }`}
              >
                <Icon size={18} />
                {item.shortLabel}
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
