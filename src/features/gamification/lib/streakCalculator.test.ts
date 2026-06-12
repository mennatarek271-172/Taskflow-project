import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  buildStreakHeatmap,
  calculateDailyStreak,
  calculateWeeklyStreak,
  toDateKey,
} from './streakCalculator'

describe('streakCalculator', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calculates daily streak', () => {
    const dates = ['2026-06-15', '2026-06-14', '2026-06-13']
    expect(calculateDailyStreak(dates)).toBe(3)
  })

  it('returns 0 when streak broken', () => {
    const dates = ['2026-06-13']
    expect(calculateDailyStreak(dates)).toBe(0)
  })

  it('calculates weekly streak', () => {
    const ref = new Date('2026-06-15')
    const weekStart = new Date(ref)
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const prevWeek = new Date(weekStart)
    prevWeek.setDate(prevWeek.getDate() - 7)
    const dates = [toDateKey(weekStart), toDateKey(prevWeek)]
    expect(calculateWeeklyStreak(dates)).toBe(2)
  })

  it('builds heatmap cells', () => {
    const cells = buildStreakHeatmap(['2026-06-15', '2026-06-15'], 2)
    expect(cells.length).toBeGreaterThan(0)
    expect(cells.some((c) => c.count === 2)).toBe(true)
  })
})
