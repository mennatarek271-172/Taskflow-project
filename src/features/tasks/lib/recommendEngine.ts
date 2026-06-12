import type { Task } from '../schemas/taskSchema'
import type { MoodType } from '@/features/mood/schemas/moodSchema'
import { scoreTaskForMood } from '@/features/mood/lib/moodEngine'
import { isOverdue } from '../utils/dateUtils'

export interface RecommendationResult {
  task: Task
  score: number
  reasons: string[]
}

const PRIORITY_LABELS = { high: 'High priority', medium: 'Medium priority', low: 'Low priority' }

function dueDateReason(task: Task): string | null {
  if (!task.dueDate) return null
  if (isOverdue(task.dueDate, task.status)) return 'Overdue — needs immediate attention'
  const due = new Date(task.dueDate)
  const today = new Date()
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff <= 3) return `Due in ${diff} days`
  return null
}

function moodReason(task: Task, mood: MoodType): string | null {
  const reasons: Record<MoodType, (t: Task) => string | null> = {
    energetic: (t) =>
      t.priority === 'high' ? 'Matches your energetic mood — tackle something big' : null,
    focused: (t) => (t.status === 'in_progress' ? 'Continue your in-progress work' : null),
    calm: (t) => (t.priority === 'low' ? 'A gentle task for a calm day' : null),
    stressed: (t) => (isOverdue(t.dueDate, t.status) ? 'Clearing this will reduce stress' : null),
    tired: (t) =>
      t.priority === 'low' && (t.subtasks.length === 0 || t.subtasks.every((s) => s.completed))
        ? 'Quick win for a low-energy day'
        : null,
  }
  return reasons[mood](task)
}

function workloadPenalty(inProgressCount: number): number {
  if (inProgressCount >= 5) return -2
  if (inProgressCount >= 3) return -1
  return 0
}

export function recommendNextTask(
  tasks: Task[],
  mood: MoodType,
  inProgressCount?: number,
): RecommendationResult | null {
  const active = tasks.filter((t) => t.status !== 'done')
  if (active.length === 0) return null

  const workload = inProgressCount ?? active.filter((t) => t.status === 'in_progress').length
  const penalty = workloadPenalty(workload)

  let best: RecommendationResult | null = null

  for (const task of active) {
    const moodScore = scoreTaskForMood(task, mood)
    const score = moodScore + penalty

    const reasons: string[] = []
    const due = dueDateReason(task)
    if (due) reasons.push(due)
    reasons.push(PRIORITY_LABELS[task.priority])
    const moodR = moodReason(task, mood)
    if (moodR) reasons.push(moodR)
    if (task.status === 'in_progress') reasons.push('Already in progress')
    if (workload >= 3) reasons.push('Consider finishing current work before starting more')

    if (!best || score > best.score) {
      best = { task, score, reasons: [...new Set(reasons)] }
    }
  }

  return best
}
