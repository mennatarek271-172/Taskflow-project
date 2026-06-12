import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FocusPhase = 'work' | 'break' | 'idle'

interface FocusState {
  phase: FocusPhase
  taskId: string | null
  taskTitle: string | null
  secondsRemaining: number
  totalFocusSeconds: number
  isRunning: boolean
  workDuration: number
  breakDuration: number
  startFocus: (taskId: string, taskTitle: string) => void
  pause: () => void
  resume: () => void
  tick: () => void
  stop: () => void
  skipBreak: () => void
}

const DEFAULT_WORK = 25 * 60
const DEFAULT_BREAK = 5 * 60

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      phase: 'idle',
      taskId: null,
      taskTitle: null,
      secondsRemaining: DEFAULT_WORK,
      totalFocusSeconds: 0,
      isRunning: false,
      workDuration: DEFAULT_WORK,
      breakDuration: DEFAULT_BREAK,

      startFocus: (taskId, taskTitle) =>
        set({
          phase: 'work',
          taskId,
          taskTitle,
          secondsRemaining: get().workDuration,
          isRunning: true,
        }),

      pause: () => set({ isRunning: false }),

      resume: () => set({ isRunning: true }),

      tick: () => {
        const {
          secondsRemaining,
          phase,
          isRunning,
          workDuration,
          breakDuration,
          totalFocusSeconds,
        } = get()
        if (!isRunning || phase === 'idle') return

        if (secondsRemaining <= 1) {
          if (phase === 'work') {
            set({
              phase: 'break',
              secondsRemaining: breakDuration,
              totalFocusSeconds: totalFocusSeconds + workDuration,
              isRunning: true,
            })
          } else {
            set({
              phase: 'idle',
              secondsRemaining: workDuration,
              isRunning: false,
              taskId: null,
              taskTitle: null,
            })
          }
          return
        }

        set({ secondsRemaining: secondsRemaining - 1 })
      },

      stop: () =>
        set({
          phase: 'idle',
          taskId: null,
          taskTitle: null,
          secondsRemaining: get().workDuration,
          isRunning: false,
        }),

      skipBreak: () =>
        set({
          phase: 'idle',
          secondsRemaining: get().workDuration,
          isRunning: false,
          taskId: null,
          taskTitle: null,
        }),
    }),
    {
      name: 'focus-store',
      partialize: (s) => ({ totalFocusSeconds: s.totalFocusSeconds, workDuration: s.workDuration }),
    },
  ),
)
