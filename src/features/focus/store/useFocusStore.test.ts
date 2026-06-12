import { beforeEach, describe, expect, it } from 'vitest'
import { useFocusStore } from './useFocusStore'

describe('useFocusStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useFocusStore.setState({
      phase: 'idle',
      taskId: null,
      taskTitle: null,
      secondsRemaining: 1500,
      totalFocusSeconds: 0,
      isRunning: false,
      workDuration: 1500,
      breakDuration: 300,
    })
  })

  it('starts focus session', () => {
    useFocusStore.getState().startFocus('t1', 'Test task')
    const state = useFocusStore.getState()
    expect(state.phase).toBe('work')
    expect(state.taskId).toBe('t1')
    expect(state.isRunning).toBe(true)
  })

  it('ticks down and switches to break', () => {
    useFocusStore.setState({
      secondsRemaining: 1,
      phase: 'work',
      isRunning: true,
      workDuration: 1500,
      breakDuration: 300,
    })
    useFocusStore.getState().tick()
    expect(useFocusStore.getState().phase).toBe('break')
    expect(useFocusStore.getState().totalFocusSeconds).toBe(1500)
  })

  it('stops focus session', () => {
    useFocusStore.getState().startFocus('t1', 'Test')
    useFocusStore.getState().stop()
    expect(useFocusStore.getState().phase).toBe('idle')
    expect(useFocusStore.getState().taskId).toBeNull()
  })
})
