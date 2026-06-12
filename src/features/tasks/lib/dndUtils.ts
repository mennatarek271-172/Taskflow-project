import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import type { TaskStatus } from '../schemas/taskSchema'
import { TASK_STATUS_ORDER } from '../utils/taskUtils'

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && TASK_STATUS_ORDER.includes(value as TaskStatus)
}

export function resolveDropStatus(event: DragEndEvent | DragOverEvent): TaskStatus | null {
  const { over } = event
  if (!over) return null

  if (isTaskStatus(over.id)) return over.id

  const data = over.data.current as { status?: TaskStatus } | undefined
  if (data?.status && isTaskStatus(data.status)) return data.status

  return null
}

export function resolveDragTaskId(event: DragEndEvent): string | null {
  const id = event.active.id
  return typeof id === 'string' ? id : null
}

export function shouldMoveTask(
  currentStatus: TaskStatus,
  targetStatus: TaskStatus | null,
): boolean {
  if (!targetStatus) return false
  return currentStatus !== targetStatus
}
