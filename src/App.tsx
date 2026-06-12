import { lazy, Suspense, useCallback, useMemo, useRef, useState } from 'react'
import { BadgeUnlockModal } from '@/features/gamification/components/BadgeUnlockModal'
import { DailyCheckInModal } from '@/features/mood/components/DailyCheckInModal'
import { MoodIndicator } from '@/features/mood/components/MoodIndicator'
import { KanbanBoard } from '@/features/tasks'
import type { Task } from '@/features/tasks/schemas/taskSchema'
import { downloadCsv } from '@/lib/export/csvExport'
import { useTaskStore } from '@/store/useTaskStore'
import { useAppStore } from '@/store/useAppStore'
import {
  Avatar,
  Badge,
  ThemeToggle,
  ToastContainer,
  AppNav,
  CommandPalette,
  KeyboardShortcutsModal,
  ErrorBoundary,
  type AppTab,
  type CommandAction,
} from '@/shared/components'
import { useKeyboardShortcuts } from '@/shared/hooks/useKeyboardShortcuts'

const AnalyticsPage = lazy(() =>
  import('@/features/analytics/components/AnalyticsPage').then((m) => ({
    default: m.AnalyticsPage,
  })),
)

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('board')
  const [commandOpen, setCommandOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)

  const tasks = useTaskStore((s) => s.tasks)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  const focusSearch = useCallback(() => {
    const input = document.querySelector<HTMLInputElement>('[data-testid="task-search"]')
    input?.focus()
    searchRef.current = input
  }, [])

  useKeyboardShortcuts({
    onCommandPalette: () => setCommandOpen(true),
    onShortcutsHelp: () => setShortcutsOpen(true),
    onNewTask: () => window.dispatchEvent(new CustomEvent('taskflow:new-task')),
    onGoBoard: () => setActiveTab('board'),
    onGoAnalytics: () => setActiveTab('analytics'),
    onToggleTheme: toggleTheme,
    onFocusSearch: focusSearch,
  })

  const commandActions: CommandAction[] = useMemo(
    () => [
      {
        id: 'new-task',
        label: 'New Task',
        group: 'Actions',
        shortcut: 'N',
        onSelect: () => window.dispatchEvent(new CustomEvent('taskflow:new-task')),
      },
      {
        id: 'board',
        label: 'Go to Board',
        group: 'Navigation',
        shortcut: 'G B',
        onSelect: () => setActiveTab('board'),
      },
      {
        id: 'analytics',
        label: 'Go to Analytics',
        group: 'Navigation',
        shortcut: 'G A',
        onSelect: () => setActiveTab('analytics'),
      },
      {
        id: 'export-csv',
        label: 'Export tasks to CSV',
        group: 'Actions',
        onSelect: () => downloadCsv(useTaskStore.getState().tasks),
      },
      {
        id: 'toggle-theme',
        label: 'Toggle theme',
        group: 'Actions',
        shortcut: 'T',
        onSelect: toggleTheme,
      },
      {
        id: 'shortcuts',
        label: 'Keyboard shortcuts',
        group: 'Help',
        shortcut: '?',
        onSelect: () => setShortcutsOpen(true),
      },
    ],
    [toggleTheme],
  )

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <header className="border-b border-[var(--border-default)] bg-[var(--bg-secondary)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Avatar name="TaskFlow" size="sm" />
              <div>
                <h1 className="text-base font-bold text-[var(--text-primary)] sm:text-lg">
                  TaskFlow
                </h1>
                <p className="text-xs text-[var(--text-muted)]">Productivity Suite</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <AppNav activeTab={activeTab} onTabChange={setActiveTab} />
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="hidden rounded-[var(--radius-md)] border border-[var(--border-default)] px-2.5 py-1.5 text-xs text-[var(--text-muted)] hover:border-[var(--accent)] sm:inline-flex sm:items-center sm:gap-1"
                aria-label="Open command palette"
              >
                <span>⌘K</span>
              </button>
              <MoodIndicator />
              <Badge variant="primary">v1.0.0</Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="main-content" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {activeTab === 'board' ? (
            <KanbanBoard
              externalSelectedTask={selectedTask}
              onExternalTaskHandled={() => setSelectedTask(null)}
            />
          ) : (
            <Suspense
              fallback={
                <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--text-muted)]">
                  Loading analytics…
                </div>
              }
            >
              <AnalyticsPage />
            </Suspense>
          )}
        </main>

        <DailyCheckInModal />
        <BadgeUnlockModal />
        <ToastContainer />
        <CommandPalette
          isOpen={commandOpen}
          onClose={() => setCommandOpen(false)}
          actions={commandActions}
          tasks={tasks}
          onTaskSelect={(task) => {
            setActiveTab('board')
            setSelectedTask(task)
          }}
        />
        <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      </div>
    </ErrorBoundary>
  )
}
