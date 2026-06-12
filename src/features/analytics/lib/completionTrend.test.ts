import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { buildTask } from '@/features/tasks/utils/taskUtils'
import type { Task } from '@/features/tasks/schemas/taskSchema'
import { aggregateCompletionTrend } from './completionTrend'

function taskWith(overrides: Partial<Task> & { title: string }): Task {
  return { ...buildTask({ title: overrides.title }), ...overrides }
}

describe('completionTrend', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('aggregates weekly created and completed', () => {
    const tasks = [
      taskWith({
        title: 'A',
        createdAt: '2026-06-10T10:00:00Z',
        updatedAt: '2026-06-10T10:00:00Z',
        status: 'todo',
      }),
      taskWith({
        title: 'B',
        createdAt: '2026-06-10T10:00:00Z',
        updatedAt: '2026-06-12T10:00:00Z',
        status: 'done',
      }),
    ]
    const trend = aggregateCompletionTrend(tasks, 'weekly')
    expect(trend.some((p) => p.created > 0)).toBe(true)
    expect(trend.some((p) => p.completed > 0)).toBe(true)
  })

  it('aggregates monthly data', () => {
    const tasks = [
      taskWith({
        title: 'A',
        createdAt: '2026-05-10T10:00:00Z',
        updatedAt: '2026-05-15T10:00:00Z',
        status: 'done',
      }),
    ]
    const trend = aggregateCompletionTrend(tasks, 'monthly', new Date('2026-06-15'))
    expect(trend.length).toBeGreaterThan(0)
  })

  it('returns empty buckets when no tasks', () => {
    expect(aggregateCompletionTrend([], 'weekly')).toEqual([])
  })
})
