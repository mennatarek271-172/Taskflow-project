import { cn } from '@/shared/utils/cn'
import type { TaskStatus } from '../../schemas/taskSchema'
import { TASK_STATUS_LABELS } from '../../utils/taskUtils'

export interface MobileColumnTabsProps {
  active: TaskStatus
  counts: Record<TaskStatus, number>
  onChange: (status: TaskStatus) => void
}

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done']

export function MobileColumnTabs({ active, counts, onChange }: MobileColumnTabsProps) {
  return (
    <div
      className="flex gap-1 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-1 md:hidden"
      data-testid="mobile-column-tabs"
      role="tablist"
    >
      {STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          role="tab"
          aria-selected={active === status}
          onClick={() => onChange(status)}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
            active === status
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
          )}
        >
          {TASK_STATUS_LABELS[status]}
          <span
            className={cn(
              'rounded-[var(--radius-full)] px-1.5 py-0.5 text-xs',
              active === status ? 'bg-white/20' : 'bg-[var(--bg-tertiary)]',
            )}
          >
            {counts[status]}
          </span>
        </button>
      ))}
    </div>
  )
}
