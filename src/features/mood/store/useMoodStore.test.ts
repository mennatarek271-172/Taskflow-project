import { beforeEach, describe, expect, it } from 'vitest'
import { getTodayDateKey } from '../constants/moodConfig'
import { useMoodStore } from './useMoodStore'

describe('useMoodStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useMoodStore.setState({ entries: [], checkInDismissedDate: null })
    document.documentElement.removeAttribute('data-mood')
  })

  it('persists today mood', () => {
    useMoodStore.getState().setTodayMood('focused')
    expect(useMoodStore.getState().getTodayMood()).toBe('focused')
    expect(document.documentElement.getAttribute('data-mood')).toBe('focused')
  })

  it('needs check-in when no entry today', () => {
    expect(useMoodStore.getState().needsCheckIn()).toBe(true)
    useMoodStore.getState().setTodayMood('calm')
    expect(useMoodStore.getState().needsCheckIn()).toBe(false)
  })

  it('stores entry with today date', () => {
    useMoodStore.getState().setTodayMood('energetic')
    const entry = useMoodStore.getState().entries.find((e) => e.date === getTodayDateKey())
    expect(entry?.mood).toBe('energetic')
  })
})
