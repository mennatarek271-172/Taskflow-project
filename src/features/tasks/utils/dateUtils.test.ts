import { describe, expect, it } from 'vitest'
import { isOverdue, isDueToday, toDateInputValue } from './dateUtils'

describe('dateUtils', () => {
  it('detects overdue tasks', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(isOverdue(toDateInputValue(yesterday), 'todo')).toBe(true)
    expect(isOverdue(toDateInputValue(yesterday), 'done')).toBe(false)
  })

  it('detects due today', () => {
    expect(isDueToday(toDateInputValue(new Date()))).toBe(true)
  })
})
