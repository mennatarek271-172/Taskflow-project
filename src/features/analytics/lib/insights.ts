import type { Task, TaskPriority, TaskStatus } from '@/features/tasks/schemas/taskSchema'
import { dayName, getCompletionDate } from './analyticsUtils'

export interface AnalyticsInsights {
  mostProductiveDay: string
  mostProductiveCount: number
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  statusDistribution: Record<TaskStatus, number>
  priorityDistribution: Record<TaskPriority, number>
}

const EMPTY_STATUS: Record<TaskStatus, number> = { todo: 0, in_progress: 0, done: 0 }
const EMPTY_PRIORITY: Record<TaskPriority, number> = { low: 0, medium: 0, high: 0 }

export function computeInsights(tasks: Task[]): AnalyticsInsights {
  const statusDistribution: Record<TaskStatus, number> = { ...EMPTY_STATUS }
  const priorityDistribution: Record<TaskPriority, number> = { ...EMPTY_PRIORITY }
  const completionsByDay = new Map<string, number>()

  for (const task of tasks) {
    statusDistribution[task.status] += 1
    priorityDistribution[task.priority] += 1

    const completed = getCompletionDate(task)
    if (completed) {
      const name = dayName(completed)
      completionsByDay.set(name, (completionsByDay.get(name) ?? 0) + 1)
    }
  }

  let mostProductiveDay = 'No data yet'
  let mostProductiveCount = 0
  for (const [day, count] of completionsByDay) {
    if (count > mostProductiveCount) {
      mostProductiveDay = day
      mostProductiveCount = count
    }
  }

  return {
    mostProductiveDay,
    mostProductiveCount,
    totalTasks: tasks.length,
    completedTasks: statusDistribution.done,
    inProgressTasks: statusDistribution.in_progress,
    todoTasks: statusDistribution.todo,
    statusDistribution,
    priorityDistribution,
  }
}
