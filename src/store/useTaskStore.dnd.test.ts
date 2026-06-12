import { beforeEach, describe, expect, it, vi } from 'vitest'
import { taskRepository } from '@/lib/repository/taskRepository'
import { useTaskStore } from './useTaskStore'

describe('useTaskStore DnD move', () => {
  beforeEach(() => {
    localStorage.clear()
    taskRepository.setAll([])
    useTaskStore.setState({ tasks: [], isLoading: false })
  })

  it('updates status and updatedAt on move', () => {
    const task = useTaskStore.getState().createTask({ title: 'Drag me', status: 'todo' })
    const originalUpdatedAt = task.updatedAt

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))

    useTaskStore.getState().moveTask(task.id, 'in_progress')
    const moved = useTaskStore.getState().getTaskById(task.id)

    expect(moved?.status).toBe('in_progress')
    expect(moved?.updatedAt).not.toBe(originalUpdatedAt)
    expect(moved?.activityLog.at(-1)?.action).toBe('moved')

    vi.useRealTimers()
  })

  it('does not move when status is unchanged', () => {
    const task = useTaskStore.getState().createTask({ title: 'Stay', status: 'todo' })
    const result = useTaskStore.getState().moveTask(task.id, 'todo')
    expect(result?.status).toBe('todo')
    expect(result?.activityLog).toHaveLength(1)
  })
})
