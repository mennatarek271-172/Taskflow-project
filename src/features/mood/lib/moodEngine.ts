import type { Task, TaskPriority } from '@/features/tasks/schemas/taskSchema'
import type { MoodType } from '../schemas/moodSchema'

const PRIORITY_SCORE: Record<TaskPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}

/** Mood-specific weights for task attributes */
const MOOD_WEIGHTS: Record<
  MoodType,
  { priority: number; urgency: number; simplicity: number; inProgress: number }
> = {
  energetic: { priority: 1.4, urgency: 0.8, simplicity: 0.6, inProgress: 1.0 },
  focused: { priority: 0.9, urgency: 1.0, simplicity: 0.7, inProgress: 1.5 },
  calm: { priority: 0.5, urgency: 0.4, simplicity: 1.2, inProgress: 0.8 },
  stressed: { priority: 1.0, urgency: 1.8, simplicity: 0.9, inProgress: 1.2 },
  tired: { priority: 0.3, urgency: 0.6, simplicity: 1.6, inProgress: 0.5 },
}

function daysUntilDue(dueDate?: string): number | null {
  if (!dueDate) return null
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function simplicityScore(task: Task): number {
  const subtaskPenalty = task.subtasks.length * 0.15
  const descPenalty = task.description && task.description.length > 100 ? 0.2 : 0
  const priorityBonus = task.priority === 'low' ? 0.5 : task.priority === 'medium' ? 0.25 : 0
  return Math.max(0, 1 + priorityBonus - subtaskPenalty - descPenalty)
}

function urgencyScore(task: Task): number {
  if (task.status === 'done') return 0
  const days = daysUntilDue(task.dueDate)
  if (days === null) return 0.2
  if (days < 0) return 1
  if (days === 0) return 0.9
  if (days <= 2) return 0.7
  if (days <= 7) return 0.4
  return 0.1
}

export function scoreTaskForMood(task: Task, mood: MoodType): number {
  if (task.status === 'done') return -Infinity

  const weights = MOOD_WEIGHTS[mood]
  const priority = PRIORITY_SCORE[task.priority]
  const urgency = urgencyScore(task)
  const simplicity = simplicityScore(task)
  const inProgress = task.status === 'in_progress' ? 1 : 0

  return (
    priority * weights.priority +
    urgency * weights.urgency +
    simplicity * weights.simplicity +
    inProgress * weights.inProgress
  )
}

export function sortTasksByMood(tasks: Task[], mood: MoodType): Task[] {
  return [...tasks].sort((a, b) => {
    const scoreDiff = scoreTaskForMood(b, mood) - scoreTaskForMood(a, mood)
    if (scoreDiff !== 0) return scoreDiff
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

export function filterTasksForMood(tasks: Task[], mood: MoodType): Task[] {
  if (mood === 'tired') {
    return tasks.filter(
      (t) => t.status !== 'done' && (t.priority !== 'high' || urgencyScore(t) > 0.5),
    )
  }
  return tasks
}

export function applyMoodToTasks(tasks: Task[], mood: MoodType): Task[] {
  const filtered = filterTasksForMood(tasks, mood)
  return sortTasksByMood(filtered, mood)
}
