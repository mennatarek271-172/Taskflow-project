import { cn } from '@/shared/utils/cn'

export type AppTab = 'board' | 'analytics'

export interface AppNavProps {
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
}

const TABS: { id: AppTab; label: string }[] = [
  { id: 'board', label: 'Board' },
  { id: 'analytics', label: 'Analytics' },
]

export function AppNav({ activeTab, onTabChange }: AppNavProps) {
  return (
    <nav
      className="flex gap-1 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-1"
      data-testid="app-nav"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'rounded-[var(--radius-md)] px-4 py-2 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
