import { describe, expect, it } from 'vitest'
import { buildTask } from '@/features/tasks/utils/taskUtils'
import type { Task } from '@/features/tasks/schemas/taskSchema'
import { computeInsights } from './insights'

function taskWith(overrides: Partial<Task> & { title: string }): Task {
  return { ...buildTask({ title: overrides.title }), ...overrides }
}

describe('insights', () => {
  it('computes status and priority distribution', () => {
    const tasks = [
      taskWith({ title: 'A', status: 'todo', priority: 'high' }),
      taskWith({ title: 'B', status: 'done', priority: 'low' }),
      taskWith({ title: 'C', status: 'in_progress', priority: 'medium' }),
    ]
    const insights = computeInsights(tasks)
    expect(insights.totalTasks).toBe(3)
    expect(insights.statusDistribution.todo).toBe(1)
    expect(insights.statusDistribution.done).toBe(1)
    expect(insights.priorityDistribution.high).toBe(1)
  })

  it('finds most productive day', () => {
    const tasks = [
      taskWith({ title: 'Mon', status: 'done', updatedAt: '2026-06-08T10:00:00Z' }),
      taskWith({ title: 'Mon2', status: 'done', updatedAt: '2026-06-08T14:00:00Z' }),
      taskWith({ title: 'Tue', status: 'done', updatedAt: '2026-06-09T10:00:00Z' }),
    ]
    const insights = computeInsights(tasks)
    expect(insights.mostProductiveDay).toBe('Monday')
    expect(insights.mostProductiveCount).toBe(2)
  })

  it('handles empty tasks', () => {
    const insights = computeInsights([])
    expect(insights.totalTasks).toBe(0)
    expect(insights.mostProductiveDay).toBe('No data yet')
  })
})
