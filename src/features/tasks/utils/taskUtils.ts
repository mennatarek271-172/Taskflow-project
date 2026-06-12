import type { ActivityLogEntry, CreateTaskInput, Task, TaskStatus } from '../schemas/taskSchema'

export function generateId(): string {
  return crypto.randomUUID()
}

export function createActivityEntry(action: string, details?: string): ActivityLogEntry {
  return {
    id: generateId(),
    action,
    timestamp: new Date().toISOString(),
    details,
  }
}

export function buildTask(input: CreateTaskInput): Task {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title: input.title,
    description: input.description,
    status: input.status ?? 'todo',
    priority: input.priority ?? 'medium',
    assignee: input.assignee,
    dueDate: input.dueDate,
    tags: input.tags ?? [],
    subtasks: input.subtasks ?? [],
    activityLog: [createActivityEntry('created', `Task "${input.title}" created`)],
    createdAt: now,
    updatedAt: now,
  }
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

export const TASK_STATUS_ORDER: TaskStatus[] = ['todo', 'in_progress', 'done']

export const PRIORITY_COLORS: Record<Task['priority'], 'default' | 'warning' | 'danger'> = {
  low: 'default',
  medium: 'warning',
  high: 'danger',
}
