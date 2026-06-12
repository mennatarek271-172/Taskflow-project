import { motion } from 'framer-motion'
import { Badge } from '@/shared/components/Badge'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { getSafeDuration, getSafeHover, getSafeVariants } from '@/shared/motion/motionConfig'
import { slideUpVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'
import type { Task } from '../../schemas/taskSchema'
import { formatDueDate, isDueToday, isOverdue } from '../../utils/dateUtils'
import { PRIORITY_COLORS } from '../../utils/taskUtils'

export interface TaskCardProps {
  task: Task
  onClick?: () => void
  onDelete?: () => void
  layoutId?: string
  isDragging?: boolean
  className?: string
}

export function TaskCard({
  task,
  onClick,
  onDelete,
  layoutId,
  isDragging,
  className,
}: TaskCardProps) {
  const reduced = useReducedMotion()
  const overdue = isOverdue(task.dueDate, task.status)
  const dueToday = isDueToday(task.dueDate)

  return (
    <motion.div
      layout={!reduced}
      layoutId={reduced ? undefined : (layoutId ?? task.id)}
      variants={getSafeVariants(reduced, slideUpVariants)}
      initial={reduced ? false : 'hidden'}
      animate="visible"
      exit="exit"
      whileHover={getSafeHover(reduced, { y: -2, boxShadow: 'var(--shadow-md)' })}
      transition={{ duration: getSafeDuration(reduced, 0.15) }}
      className={cn(
        'group cursor-grab rounded-[var(--radius-lg)] border bg-[var(--bg-elevated)] p-4 active:cursor-grabbing',
        'border-[var(--border-default)] shadow-[var(--shadow-sm)]',
        overdue && 'border-[var(--color-danger-500)]/50',
        isDragging && 'shadow-[var(--shadow-lg)]',
        className,
      )}
      onClick={onClick}
      data-testid={`task-card-${task.id}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">{task.title}</h4>
        {onDelete ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[var(--color-danger-500)]"
            aria-label="Delete task"
          >
            ✕
          </button>
        ) : null}
      </div>

      {task.description ? (
        <p className="mb-3 line-clamp-2 text-xs text-[var(--text-secondary)]">{task.description}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
        {task.dueDate ? (
          <span
            className={cn(
              'text-xs',
              overdue
                ? 'font-medium text-[var(--color-danger-500)]'
                : dueToday
                  ? 'text-[var(--color-warning-500)]'
                  : 'text-[var(--text-muted)]',
            )}
          >
            {overdue ? '⚠ ' : ''}
            {formatDueDate(task.dueDate)}
          </span>
        ) : null}
        {task.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="default">
            {tag}
          </Badge>
        ))}
      </div>

      {task.assignee ? (
        <p className="mt-2 text-xs text-[var(--text-muted)]">@{task.assignee}</p>
      ) : null}
    </motion.div>
  )
}
