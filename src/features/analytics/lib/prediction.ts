import type { Task } from '@/features/tasks/schemas/taskSchema'
import { addDays, getCompletionDate, startOfDay } from './analyticsUtils'

export interface CompletionPrediction {
  daysRemaining: number | null
  message: string
  velocity: number
}

export function calculateVelocity(
  tasks: Task[],
  windowDays = 7,
  referenceDate: Date = new Date(),
): number {
  const end = startOfDay(referenceDate)
  const start = addDays(end, -(windowDays - 1))

  const completedInWindow = tasks.filter((task) => {
    const completed = getCompletionDate(task)
    if (!completed) return false
    const d = startOfDay(completed)
    return d >= start && d <= end
  })

  return completedInWindow.length / windowDays
}

export function predictCompletionDays(
  tasks: Task[],
  referenceDate: Date = new Date(),
): CompletionPrediction {
  const remaining = tasks.filter((t) => t.status !== 'done').length
  const velocity = calculateVelocity(tasks, 7, referenceDate)

  if (remaining === 0) {
    return { daysRemaining: 0, message: 'All tasks completed! 🎉', velocity }
  }

  if (velocity <= 0) {
    return {
      daysRemaining: null,
      message: 'Complete a few tasks to see a prediction',
      velocity: 0,
    }
  }

  const daysRemaining = Math.ceil(remaining / velocity)
  const message =
    daysRemaining === 1
      ? "You'll finish in 1 day at this pace"
      : `You'll finish in ${daysRemaining} days at this pace`

  return { daysRemaining, message, velocity }
}
