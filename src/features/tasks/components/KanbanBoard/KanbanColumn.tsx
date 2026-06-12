import { useDroppable } from '@dnd-kit/core'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/shared/utils/cn'
import type { Task, TaskStatus } from '../../schemas/taskSchema'
import { TASK_STATUS_LABELS } from '../../utils/taskUtils'
import { DraggableTaskCard } from '../DraggableTaskCard'
import { EmptyState } from '../EmptyState'

export interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  isDropTarget?: boolean
  onTaskClick: (task: Task) => void
  onTaskDelete: (task: Task) => void
  onCreateTask?: () => void
  showEmpty?: boolean
}

export function KanbanColumn({
  status,
  tasks,
  isDropTarget = false,
  onTaskClick,
  onTaskDelete,
  onCreateTask,
  showEmpty = true,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  const isActive = isOver || isDropTarget

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex min-h-[400px] flex-col rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] p-3 transition-all',
        isActive &&
          'bg-[var(--bg-tertiary)] ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-primary)]',
      )}
      data-testid={`kanban-column-${status}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          {TASK_STATUS_LABELS[status]}
        </h3>
        <span className="rounded-[var(--radius-full)] bg-[var(--bg-tertiary)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
          {tasks.length}
        </span>
      </div>

      {isActive ? (
        <motion.div
          initial={{ opacity: 0, scaleY: 0.5 }}
          animate={{ opacity: 1, scaleY: 1 }}
          className="mb-3 h-1 rounded-full bg-[var(--accent)]"
          data-testid="drop-indicator"
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              onDelete={() => onTaskDelete(task)}
            />
          ))}
        </AnimatePresence>

        {showEmpty && tasks.length === 0 ? (
          <EmptyState
            title="No tasks"
            description={`No tasks in ${TASK_STATUS_LABELS[status].toLowerCase()}`}
            icon="✨"
            actionLabel={status === 'todo' ? 'Add task' : undefined}
            onAction={status === 'todo' ? onCreateTask : undefined}
          />
        ) : null}
      </div>
    </div>
  )
}
