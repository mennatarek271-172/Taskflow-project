import { describe, expect, it } from 'vitest'
import { createTaskInputSchema, taskSchema } from './taskSchema'

describe('taskSchema', () => {
  const validTask = {
    id: '1',
    title: 'Test task',
    status: 'todo' as const,
    priority: 'medium' as const,
    tags: ['urgent'],
    subtasks: [{ id: 's1', title: 'Sub', completed: false }],
    activityLog: [{ id: 'a1', action: 'created', timestamp: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  it('validates a complete task', () => {
    expect(taskSchema.safeParse(validTask).success).toBe(true)
  })

  it('rejects task without title', () => {
    const result = taskSchema.safeParse({ ...validTask, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid status', () => {
    const result = taskSchema.safeParse({ ...validTask, status: 'invalid' })
    expect(result.success).toBe(false)
  })
})

describe('createTaskInputSchema', () => {
  it('validates minimal create input', () => {
    const result = createTaskInputSchema.safeParse({ title: 'New task' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('New task')
    }
  })

  it('rejects empty title', () => {
    const result = createTaskInputSchema.safeParse({ title: '' })
    expect(result.success).toBe(false)
  })
})
