import type { Task } from '@/features/tasks/schemas/taskSchema'
import {
  eachDay,
  endOfDay,
  getCompletionDate,
  getCreationDate,
  startOfDay,
  toDateKey,
} from './analyticsUtils'

export interface BurndownPoint {
  date: string
  label: string
  ideal: number
  actual: number
  remaining: number
}

export function countRemainingAt(tasks: Task[], at: Date): number {
  const cutoff = endOfDay(at)
  return tasks.filter((task) => {
    const created = getCreationDate(task)
    if (created > cutoff) return false
    const completed = getCompletionDate(task)
    if (completed && completed <= cutoff) return false
    return true
  }).length
}

export function generateBurndownData(
  tasks: Task[],
  rangeDays = 14,
  referenceDate: Date = new Date(),
): BurndownPoint[] {
  const end = startOfDay(referenceDate)
  const start = startOfDay(new Date(end))
  start.setDate(start.getDate() - (rangeDays - 1))

  const days = eachDay(start, end)
  const initialRemaining = countRemainingAt(tasks, start)

  return days.map((day, index) => {
    const remaining = countRemainingAt(tasks, day)
    const progress = days.length > 1 ? index / (days.length - 1) : 1
    const ideal = Math.max(0, Math.round(initialRemaining - progress * initialRemaining))

    return {
      date: toDateKey(day),
      label: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      ideal,
      actual: remaining,
      remaining,
    }
  })
}

export function getBurndownSummary(tasks: Task[]): {
  total: number
  remaining: number
  completed: number
} {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'done').length
  return { total, remaining: total - completed, completed }
}
