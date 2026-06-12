import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/shared/components/Badge'
import { Button } from '@/shared/components/Button'
import { fadeVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'
import type { TaskPriority, TaskStatus } from '../../schemas/taskSchema'
import { useFilterStore } from '../../store/useFilterStore'
import { TASK_STATUS_LABELS } from '../../utils/taskUtils'

export interface FilterPanelProps {
  assignees: string[]
}

const STATUS_OPTIONS: TaskStatus[] = ['todo', 'in_progress', 'done']
const PRIORITY_OPTIONS: TaskPriority[] = ['low', 'medium', 'high']

export function FilterPanel({ assignees }: FilterPanelProps) {
  const filters = useFilterStore((s) => s.filters)
  const toggleStatus = useFilterStore((s) => s.toggleStatus)
  const togglePriority = useFilterStore((s) => s.togglePriority)
  const toggleAssignee = useFilterStore((s) => s.toggleAssignee)
  const clearFilters = useFilterStore((s) => s.clearFilters)

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4"
      data-testid="filter-panel"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>

      <div className="space-y-4">
        <FilterGroup label="Status">
          {STATUS_OPTIONS.map((status) => (
            <FilterChip
              key={status}
              label={TASK_STATUS_LABELS[status]}
              active={filters.statuses.includes(status)}
              onClick={() => toggleStatus(status)}
            />
          ))}
        </FilterGroup>

        <FilterGroup label="Priority">
          {PRIORITY_OPTIONS.map((priority) => (
            <FilterChip
              key={priority}
              label={priority}
              active={filters.priorities.includes(priority)}
              onClick={() => togglePriority(priority)}
            />
          ))}
        </FilterGroup>

        {assignees.length > 0 ? (
          <FilterGroup label="Assignee">
            {assignees.map((assignee) => (
              <FilterChip
                key={assignee}
                label={`@${assignee}`}
                active={filters.assignees.includes(assignee)}
                onClick={() => toggleAssignee(assignee)}
              />
            ))}
          </FilterGroup>
        ) : null}
      </div>
    </motion.div>
  )
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick} className="focus-visible:outline-[var(--accent)]">
      <Badge
        variant={active ? 'primary' : 'default'}
        className={cn('cursor-pointer transition-opacity hover:opacity-80')}
      >
        {label}
      </Badge>
    </button>
  )
}
