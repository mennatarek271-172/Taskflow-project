import { AnimatePresence } from 'framer-motion'
import { Badge } from '@/shared/components/Badge'
import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal'
import type { Task } from '../../schemas/taskSchema'
import { formatDueDate, isOverdue } from '../../utils/dateUtils'
import { PRIORITY_COLORS, TASK_STATUS_LABELS } from '../../utils/taskUtils'

export interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onMovePrev?: (task: Task) => void
  onMoveNext?: (task: Task) => void
  canMovePrev?: boolean
  canMoveNext?: boolean
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onMovePrev,
  onMoveNext,
  canMovePrev,
  canMoveNext,
}: TaskDetailModalProps) {
  const overdue = task ? isOverdue(task.dueDate, task.status) : false

  return (
    <AnimatePresence>
      <Modal isOpen={isOpen && !!task} onClose={onClose} title={task?.title} size="lg">
        {task ? (
          <div className="space-y-4" data-testid="task-detail-modal">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{TASK_STATUS_LABELS[task.status]}</Badge>
              <Badge variant={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
              {task.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>

            {task.description ? (
              <p className="text-sm text-[var(--text-secondary)]">{task.description}</p>
            ) : null}

            <div className="grid gap-2 text-sm">
              {task.assignee ? (
                <p>
                  <span className="text-[var(--text-muted)]">Assignee: </span>
                  <span className="text-[var(--text-primary)]">@{task.assignee}</span>
                </p>
              ) : null}
              {task.dueDate ? (
                <p className={overdue ? 'text-[var(--color-danger-500)]' : ''}>
                  <span className="text-[var(--text-muted)]">Due: </span>
                  {formatDueDate(task.dueDate)}
                  {overdue ? ' (Overdue)' : ''}
                </p>
              ) : null}
            </div>

            {task.subtasks.length > 0 ? (
              <div>
                <h4 className="mb-2 text-sm font-medium text-[var(--text-primary)]">Subtasks</h4>
                <ul className="space-y-1">
                  {task.subtasks.map((st) => (
                    <li
                      key={st.id}
                      className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                    >
                      <span>{st.completed ? '✅' : '⬜'}</span>
                      {st.title}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {task.activityLog.length > 0 ? (
              <div>
                <h4 className="mb-2 text-sm font-medium text-[var(--text-primary)]">Activity</h4>
                <ul className="max-h-32 space-y-1 overflow-y-auto">
                  {[...task.activityLog]
                    .reverse()
                    .slice(0, 5)
                    .map((entry) => (
                      <li key={entry.id} className="text-xs text-[var(--text-muted)]">
                        {new Date(entry.timestamp).toLocaleString()} — {entry.action}
                        {entry.details ? `: ${entry.details}` : ''}
                      </li>
                    ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={() => onDelete(task)}>
                  Delete
                </Button>
                {canMovePrev && onMovePrev ? (
                  <Button variant="secondary" size="sm" onClick={() => onMovePrev(task)}>
                    ← Prev
                  </Button>
                ) : null}
                {canMoveNext && onMoveNext ? (
                  <Button variant="secondary" size="sm" onClick={() => onMoveNext(task)}>
                    Next →
                  </Button>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => onEdit(task)}>Edit</Button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </AnimatePresence>
  )
}
