import { beforeEach, describe, expect, it } from 'vitest'
import { useGamificationStore } from '@/features/gamification/store/useGamificationStore'
import { taskRepository } from '@/lib/repository/taskRepository'
import { useTaskStore } from './useTaskStore'

describe('useTaskStore gamification integration', () => {
  beforeEach(() => {
    localStorage.clear()
    taskRepository.setAll([])
    useTaskStore.setState({ tasks: [], isLoading: false })
    useGamificationStore.getState().reset()
  })

  it('awards XP when task moved to done', () => {
    const task = useTaskStore.getState().createTask({ title: 'Complete me', priority: 'medium' })
    useTaskStore.getState().moveTask(task.id, 'done')
    expect(useGamificationStore.getState().totalXp).toBe(25)
  })

  it('does not award XP when moving between non-done statuses', () => {
    const task = useTaskStore.getState().createTask({ title: 'WIP' })
    useTaskStore.getState().moveTask(task.id, 'in_progress')
    expect(useGamificationStore.getState().totalXp).toBe(0)
  })
})
