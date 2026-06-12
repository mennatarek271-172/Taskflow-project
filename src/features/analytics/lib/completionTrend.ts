import type { Task } from '@/features/tasks/schemas/taskSchema'
import { getCompletionDate, getCreationDate, startOfDay, toDateKey } from './analyticsUtils'

export type TrendPeriod = 'weekly' | 'monthly'

export interface TrendPoint {
  key: string
  label: string
  completed: number
  created: number
}

function getWeekStart(date: Date): Date {
  const d = startOfDay(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return d
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function aggregateCompletionTrend(
  tasks: Task[],
  period: TrendPeriod,
  referenceDate: Date = new Date(),
): TrendPoint[] {
  const buckets = new Map<string, TrendPoint>()

  const ensureBucket = (key: string, label: string) => {
    if (!buckets.has(key)) {
      buckets.set(key, { key, label, completed: 0, created: 0 })
    }
    return buckets.get(key)!
  }

  for (const task of tasks) {
    const created = getCreationDate(task)
    if (period === 'weekly') {
      const weekStart = getWeekStart(created)
      const key = toDateKey(weekStart)
      const label = `Week of ${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
      ensureBucket(key, label).created += 1
    } else {
      const key = getMonthKey(created)
      const label = created.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      ensureBucket(key, label).created += 1
    }

    const completed = getCompletionDate(task)
    if (!completed) continue

    if (period === 'weekly') {
      const weekStart = getWeekStart(completed)
      const key = toDateKey(weekStart)
      const label = `Week of ${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
      ensureBucket(key, label).completed += 1
    } else {
      const key = getMonthKey(completed)
      const label = completed.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
      ensureBucket(key, label).completed += 1
    }
  }

  const sorted = [...buckets.values()].sort((a, b) => a.key.localeCompare(b.key))

  if (period === 'weekly') {
    return sorted.slice(-8)
  }

  const refKey = getMonthKey(referenceDate)
  return sorted.filter((p) => p.key <= refKey).slice(-6)
}
