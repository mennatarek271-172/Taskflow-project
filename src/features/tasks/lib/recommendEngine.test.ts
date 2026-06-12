import { describe, expect, it } from 'vitest'
import { buildTask } from '../utils/taskUtils'
import { recommendNextTask } from './recommendEngine'

describe('recommendNextTask', () => {
  it('returns null when no active tasks', () => {
    const done = buildTask({ title: 'Done', status: 'done' })
    expect(recommendNextTask([done], 'focused')).toBeNull()
  })

  it('recommends high priority for energetic mood', () => {
    const low = buildTask({ title: 'Low', priority: 'low', status: 'todo' })
    const high = buildTask({ title: 'High', priority: 'high', status: 'todo' })
    const result = recommendNextTask([low, high], 'energetic')
    expect(result?.task.id).toBe(high.id)
    expect(result?.reasons.length).toBeGreaterThan(0)
  })

  it('prefers in-progress for focused mood', () => {
    const todo = buildTask({ title: 'Todo', status: 'todo' })
    const wip = buildTask({ title: 'WIP', status: 'in_progress' })
    const result = recommendNextTask([todo, wip], 'focused')
    expect(result?.task.id).toBe(wip.id)
    expect(result?.reasons).toContain('Already in progress')
  })

  it('penalizes overload', () => {
    const tasks = Array.from({ length: 5 }, (_, i) =>
      buildTask({ title: `Task ${i}`, status: 'in_progress', priority: 'medium' }),
    )
    const result = recommendNextTask(tasks, 'focused')
    expect(result?.reasons.some((r) => r.includes('finishing current work'))).toBe(true)
  })
})
