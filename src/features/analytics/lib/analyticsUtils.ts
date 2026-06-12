import type { Task } from '@/features/tasks/schemas/taskSchema'

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function eachDay(start: Date, end: Date): Date[] {
  const days: Date[] = []
  let current = startOfDay(start)
  const last = startOfDay(end)
  while (current <= last) {
    days.push(new Date(current))
    current = addDays(current, 1)
  }
  return days
}

export function getCompletionDate(task: Task): Date | null {
  if (task.status !== 'done') return null

  const movedToDone = [...task.activityLog]
    .reverse()
    .find((e) => e.action === 'moved' && e.details?.toLowerCase().includes('done'))

  return new Date(movedToDone?.timestamp ?? task.updatedAt)
}

export function getCreationDate(task: Task): Date {
  return new Date(task.createdAt)
}

export function dayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}
