import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildTask } from '@/features/tasks/utils/taskUtils'
import { useGamificationStore } from './useGamificationStore'

describe('useGamificationStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useGamificationStore.getState().reset()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
  })

  it('awards XP on task completion', () => {
    const task = buildTask({ title: 'High task', priority: 'high', status: 'done' })
    useGamificationStore.getState().awardTaskCompletion(task)
    expect(useGamificationStore.getState().totalXp).toBe(50)
    expect(useGamificationStore.getState().totalCompletions).toBe(1)
  })

  it('unlocks first steps badge', () => {
    const task = buildTask({ title: 'First', priority: 'low', status: 'done' })
    useGamificationStore.getState().awardTaskCompletion(task)
    expect(useGamificationStore.getState().unlockedBadgeIds).toContain('first_steps')
    expect(useGamificationStore.getState().pendingBadge?.id).toBe('first_steps')
  })

  it('tracks daily streak', () => {
    const task = buildTask({ title: 'Task', status: 'done' })
    useGamificationStore.getState().awardTaskCompletion(task)
    expect(useGamificationStore.getState().getDailyStreak()).toBe(1)
  })
})
