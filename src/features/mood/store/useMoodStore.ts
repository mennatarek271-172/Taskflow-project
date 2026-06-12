import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTodayDateKey } from '../constants/moodConfig'
import type { MoodEntry, MoodType } from '../schemas/moodSchema'

interface MoodState {
  entries: MoodEntry[]
  checkInDismissedDate: string | null
  setTodayMood: (mood: MoodType) => void
  getTodayMood: () => MoodType | null
  needsCheckIn: () => boolean
  dismissCheckIn: () => void
  applyMoodTheme: (mood: MoodType | null) => void
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      entries: [],
      checkInDismissedDate: null,

      setTodayMood: (mood) => {
        const date = getTodayDateKey()
        const entry: MoodEntry = { mood, date, timestamp: new Date().toISOString() }
        set((state) => ({
          entries: [...state.entries.filter((e) => e.date !== date), entry],
          checkInDismissedDate: date,
        }))
        get().applyMoodTheme(mood)
      },

      getTodayMood: () => {
        const date = getTodayDateKey()
        return get().entries.find((e) => e.date === date)?.mood ?? null
      },

      needsCheckIn: () => {
        const date = getTodayDateKey()
        const hasToday = get().entries.some((e) => e.date === date)
        const dismissed = get().checkInDismissedDate === date
        return !hasToday && !dismissed
      },

      dismissCheckIn: () => set({ checkInDismissedDate: getTodayDateKey() }),

      applyMoodTheme: (mood) => {
        if (mood) {
          document.documentElement.setAttribute('data-mood', mood)
        } else {
          document.documentElement.removeAttribute('data-mood')
        }
      },
    }),
    {
      name: 'mood-store',
      onRehydrateStorage: () => (state) => {
        if (state) state.applyMoodTheme(state.getTodayMood())
      },
    },
  ),
)
