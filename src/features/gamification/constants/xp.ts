import type { TaskPriority } from '@/features/tasks/schemas/taskSchema'

export const XP_BY_PRIORITY: Record<TaskPriority, number> = {
  low: 10,
  medium: 25,
  high: 50,
}

export const XP_PER_LEVEL = 200

export function xpForPriority(priority: TaskPriority): number {
  return XP_BY_PRIORITY[priority]
}

export function levelFromXp(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1
}

export function xpProgressInLevel(totalXp: number): {
  current: number
  max: number
  percent: number
} {
  const current = totalXp % XP_PER_LEVEL
  const max = XP_PER_LEVEL
  return { current, max, percent: (current / max) * 100 }
}
