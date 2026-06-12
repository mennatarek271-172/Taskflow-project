import { describe, expect, it } from 'vitest'
import { isTaskStatus, resolveDropStatus, shouldMoveTask } from './dndUtils'

describe('dndUtils', () => {
  it('identifies valid task statuses', () => {
    expect(isTaskStatus('todo')).toBe(true)
    expect(isTaskStatus('invalid')).toBe(false)
  })

  it('resolves drop status from droppable id', () => {
    const event = {
      over: { id: 'in_progress', data: { current: { status: 'in_progress' } } },
    } as unknown as Parameters<typeof resolveDropStatus>[0]

    expect(resolveDropStatus(event)).toBe('in_progress')
  })

  it('determines when task should move', () => {
    expect(shouldMoveTask('todo', 'in_progress')).toBe(true)
    expect(shouldMoveTask('todo', 'todo')).toBe(false)
    expect(shouldMoveTask('todo', null)).toBe(false)
  })
})
