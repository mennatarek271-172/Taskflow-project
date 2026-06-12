import { beforeEach, describe, expect, it } from 'vitest'
import { taskRepository } from '@/lib/repository/taskRepository'
import { useTaskStore } from './useTaskStore'

describe('useTaskStore', () => {
  beforeEach(() => {
    localStorage.clear()
    taskRepository.setAll([])
    useTaskStore.setState({ tasks: [], isLoading: false })
  })

  it('creates a task', () => {
    const task = useTaskStore.getState().createTask({ title: 'New task' })
    expect(task.title).toBe('New task')
    expect(useTaskStore.getState().tasks).toHaveLength(1)
  })

  it('updates a task', () => {
    const task = useTaskStore.getState().createTask({ title: 'Original' })
    useTaskStore.getState().updateTask(task.id, { title: 'Updated' })
    expect(useTaskStore.getState().getTaskById(task.id)?.title).toBe('Updated')
  })

  it('deletes a task', () => {
    const task = useTaskStore.getState().createTask({ title: 'To delete' })
    useTaskStore.getState().deleteTask(task.id)
    expect(useTaskStore.getState().tasks).toHaveLength(0)
  })

  it('moves a task between statuses', () => {
    const task = useTaskStore.getState().createTask({ title: 'Move me' })
    useTaskStore.getState().moveTask(task.id, 'in_progress')
    expect(useTaskStore.getState().getTaskById(task.id)?.status).toBe('in_progress')
  })

  it('filters tasks by status', () => {
    useTaskStore.getState().createTask({ title: 'A', status: 'todo' })
    useTaskStore.getState().createTask({ title: 'B', status: 'done' })
    expect(useTaskStore.getState().getTasksByStatus('todo')).toHaveLength(1)
  })
})
