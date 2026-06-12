import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { buildTask } from '@/features/tasks/utils/taskUtils'
import type { Task } from '@/features/tasks/schemas/taskSchema'
import { calculateVelocity, predictCompletionDays } from './prediction'

function taskWith(overrides: Partial<Task> & { title: string }): Task {
  return { ...buildTask({ title: overrides.title }), ...overrides }
}

describe('prediction', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('predicts finish when velocity exists', () => {
    const tasks = [
      taskWith({
        title: 'Done',
        status: 'done',
        updatedAt: '2026-06-14T10:00:00Z',
        createdAt: '2026-06-10T10:00:00Z',
      }),
      taskWith({ title: 'Open 1', status: 'todo' }),
      taskWith({ title: 'Open 2', status: 'todo' }),
    ]
    const result = predictCompletionDays(tasks)
    expect(result.daysRemaining).toBeGreaterThan(0)
    expect(result.message).toContain('finish in')
  })

  it('returns null prediction with no velocity', () => {
    const tasks = [taskWith({ title: 'Open', status: 'todo' })]
    const result = predictCompletionDays(tasks)
    expect(result.daysRemaining).toBeNull()
    expect(result.velocity).toBe(0)
  })

  it('handles all tasks completed', () => {
    const tasks = [taskWith({ title: 'Done', status: 'done', updatedAt: '2026-06-14T10:00:00Z' })]
    const result = predictCompletionDays(tasks)
    expect(result.daysRemaining).toBe(0)
    expect(result.message).toContain('All tasks completed')
  })

  it('calculates velocity over window', () => {
    const tasks = [
      taskWith({ title: 'D1', status: 'done', updatedAt: '2026-06-14T10:00:00Z' }),
      taskWith({ title: 'D2', status: 'done', updatedAt: '2026-06-13T10:00:00Z' }),
    ]
    expect(calculateVelocity(tasks, 7)).toBeCloseTo(2 / 7)
  })
})
