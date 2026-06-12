import { describe, expect, it } from 'vitest'
import { checkBadgeUnlock, getNewlyUnlockedBadges } from './badges'

describe('badge engine', () => {
  const base = {
    totalXp: 0,
    totalCompletions: 0,
    dailyStreak: 0,
    weeklyStreak: 0,
    unlockedBadgeIds: [] as string[],
  }

  it('unlocks first steps badge', () => {
    expect(checkBadgeUnlock('first_steps', { ...base, totalCompletions: 1 })).toBe(true)
  })

  it('unlocks bronze at 100 XP', () => {
    expect(checkBadgeUnlock('bronze', { ...base, totalXp: 100 })).toBe(true)
    expect(checkBadgeUnlock('bronze', { ...base, totalXp: 50 })).toBe(false)
  })

  it('unlocks productivity master at 2500 XP', () => {
    expect(checkBadgeUnlock('productivity_master', { ...base, totalXp: 2500 })).toBe(true)
  })

  it('returns newly unlocked badges only', () => {
    const stats = { ...base, totalCompletions: 1, totalXp: 100 }
    const newBadges = getNewlyUnlockedBadges(stats)
    expect(newBadges.map((b) => b.id)).toContain('first_steps')
    expect(newBadges.map((b) => b.id)).toContain('bronze')
  })

  it('skips already unlocked badges', () => {
    const stats = {
      ...base,
      totalCompletions: 1,
      unlockedBadgeIds: ['first_steps'],
    }
    const newBadges = getNewlyUnlockedBadges(stats)
    expect(newBadges.find((b) => b.id === 'first_steps')).toBeUndefined()
  })
})
