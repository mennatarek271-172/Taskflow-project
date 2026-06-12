import { describe, expect, it } from 'vitest'
import { levelFromXp, xpForPriority, xpProgressInLevel, XP_BY_PRIORITY } from './xp'

describe('xp constants', () => {
  it('assigns correct XP by priority', () => {
    expect(XP_BY_PRIORITY.low).toBe(10)
    expect(XP_BY_PRIORITY.medium).toBe(25)
    expect(XP_BY_PRIORITY.high).toBe(50)
    expect(xpForPriority('high')).toBe(50)
  })

  it('calculates level from XP', () => {
    expect(levelFromXp(0)).toBe(1)
    expect(levelFromXp(200)).toBe(2)
    expect(levelFromXp(450)).toBe(3)
  })

  it('calculates progress within level', () => {
    const progress = xpProgressInLevel(50)
    expect(progress.current).toBe(50)
    expect(progress.max).toBe(200)
    expect(progress.percent).toBe(25)
  })
})
