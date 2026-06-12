import { describe, expect, it } from 'vitest'
import { buildTask } from '@/features/tasks/utils/taskUtils'
import { applyMoodToTasks, scoreTaskForMood, sortTasksByMood } from './moodEngine'

const highPriority = buildTask({ title: 'Big project', priority: 'high', status: 'todo' })
const lowPriority = buildTask({ title: 'Easy task', priority: 'low', status: 'todo' })
const inProgress = buildTask({ title: 'Current work', priority: 'medium', status: 'in_progress' })

describe('moodEngine', () => {
  it('scores tasks differently per mood', () => {
    expect(scoreTaskForMood(highPriority, 'energetic')).toBeGreaterThan(
      scoreTaskForMood(lowPriority, 'energetic'),
    )
    expect(scoreTaskForMood(lowPriority, 'tired')).toBeGreaterThan(
      scoreTaskForMood(highPriority, 'tired'),
    )
    expect(scoreTaskForMood(inProgress, 'focused')).toBeGreaterThan(
      scoreTaskForMood(highPriority, 'focused'),
    )
  })

  it('sorts tasks by mood priority', () => {
    const energetic = sortTasksByMood([lowPriority, highPriority, inProgress], 'energetic')
    expect(energetic[0].priority).toBe('high')

    const tired = sortTasksByMood([lowPriority, highPriority], 'tired')
    expect(tired[0].priority).toBe('low')
  })

  it('reorders board when mood changes', () => {
    const tasks = [lowPriority, highPriority]
    const energeticOrder = applyMoodToTasks(tasks, 'energetic').map((t) => t.id)
    const tiredOrder = applyMoodToTasks(tasks, 'tired').map((t) => t.id)
    expect(energeticOrder).not.toEqual(tiredOrder)
    expect(energeticOrder[0]).toBe(highPriority.id)
    expect(tiredOrder[0]).toBe(lowPriority.id)
  })
})
