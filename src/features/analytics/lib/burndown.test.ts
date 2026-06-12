import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { buildTask } from '@/features/tasks/utils/taskUtils'
import type { Task } from '@/features/tasks/schemas/taskSchema'
import { countRemainingAt, generateBurndownData, getBurndownSummary } from './burndown'

function taskWith(overrides: Partial<Task> & { title: string }): Task {
  return { ...buildTask({ title: overrides.title }), ...overrides }
}

describe('burndown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts remaining tasks at a date', () => {
    const tasks = [
      taskWith({
        title: 'Open',
        status: 'todo',
        createdAt: '2026-06-10T10:00:00Z',
        updatedAt: '2026-06-10T10:00:00Z',
      }),
      taskWith({
        title: 'Done',
        status: 'done',
        createdAt: '2026-06-10T10:00:00Z',
        updatedAt: '2026-06-12T10:00:00Z',
      }),
    ]
    expect(countRemainingAt(tasks, new Date('2026-06-14'))).toBe(1)
  })

  it('generates burndown points for date range', () => {
    const tasks = [
      taskWith({
        title: 'A',
        status: 'todo',
        createdAt: '2026-06-01T10:00:00Z',
        updatedAt: '2026-06-01T10:00:00Z',
      }),
    ]
    const data = generateBurndownData(tasks, 7, new Date('2026-06-15'))
    expect(data).toHaveLength(7)
    expect(data[data.length - 1].actual).toBe(1)
  })

  it('handles all tasks completed', () => {
    const tasks = [
      taskWith({
        title: 'Done',
        status: 'done',
        createdAt: '2026-06-14T10:00:00Z',
        updatedAt: '2026-06-14T12:00:00Z',
      }),
    ]
    const summary = getBurndownSummary(tasks)
    expect(summary.remaining).toBe(0)
    expect(summary.completed).toBe(1)
  })

  it('handles no completed tasks', () => {
    const tasks = [taskWith({ title: 'Open', status: 'todo' })]
    const summary = getBurndownSummary(tasks)
    expect(summary.remaining).toBe(1)
    expect(summary.completed).toBe(0)
  })
})
