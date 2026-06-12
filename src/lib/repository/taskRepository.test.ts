import { beforeEach, describe, expect, it } from 'vitest'
import { buildTask } from '@/features/tasks/utils/taskUtils'
import { TaskRepository } from './taskRepository'

describe('TaskRepository persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists tasks to localStorage', () => {
    const repo = new TaskRepository()
    const task = buildTask({ title: 'Persisted task' })
    repo.createAndSave(task)

    const repo2 = new TaskRepository()
    const loaded = repo2.load()
    expect(loaded).toHaveLength(1)
    expect(loaded[0].title).toBe('Persisted task')
  })

  it('survives reload simulation', () => {
    const repo = new TaskRepository()
    repo.createAndSave(buildTask({ title: 'Task 1' }))
    repo.createAndSave(buildTask({ title: 'Task 2' }))

    const freshRepo = new TaskRepository()
    freshRepo.load()
    expect(freshRepo.getAll()).toHaveLength(2)
  })
})
