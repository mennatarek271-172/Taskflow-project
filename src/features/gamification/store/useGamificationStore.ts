import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task } from '@/features/tasks/schemas/taskSchema'
import { useToastStore } from '@/shared/store/useToastStore'
import { getBadgeById, getNewlyUnlockedBadges, type BadgeDefinition } from '../constants/badges'
import { levelFromXp, xpForPriority } from '../constants/xp'
import { calculateDailyStreak, calculateWeeklyStreak, toDateKey } from '../lib/streakCalculator'

interface GamificationState {
  totalXp: number
  totalCompletions: number
  completionDates: string[]
  unlockedBadgeIds: string[]
  pendingBadge: BadgeDefinition | null
  lastXpGain: number
  awardTaskCompletion: (task: Task) => void
  dismissBadgeModal: () => void
  getDailyStreak: () => number
  getWeeklyStreak: () => number
  getLevel: () => number
  reset: () => void
}

const initialState = {
  totalXp: 0,
  totalCompletions: 0,
  completionDates: [] as string[],
  unlockedBadgeIds: [] as string[],
  pendingBadge: null as BadgeDefinition | null,
  lastXpGain: 0,
}

function notifyGamification(message: string) {
  useToastStore.getState().addGamificationToast(message)
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      awardTaskCompletion: (task) => {
        const xp = xpForPriority(task.priority)
        const today = toDateKey(new Date())

        set((state) => {
          const totalXp = state.totalXp + xp
          const totalCompletions = state.totalCompletions + 1
          const completionDates = [...state.completionDates, today]

          const stats = {
            totalXp,
            totalCompletions,
            dailyStreak: calculateDailyStreak(completionDates),
            weeklyStreak: calculateWeeklyStreak(completionDates),
            unlockedBadgeIds: state.unlockedBadgeIds,
          }

          const newBadges = getNewlyUnlockedBadges(stats)
          const unlockedBadgeIds = [...state.unlockedBadgeIds, ...newBadges.map((b) => b.id)]
          const pendingBadge = newBadges[0] ?? null

          notifyGamification(`+${xp} XP for completing "${task.title}"`)

          if (pendingBadge) {
            notifyGamification(`Badge unlocked: ${pendingBadge.emoji} ${pendingBadge.name}!`)
          }

          const newLevel = levelFromXp(totalXp)
          const oldLevel = levelFromXp(state.totalXp)
          if (newLevel > oldLevel) {
            notifyGamification(`Level up! You're now level ${newLevel}`)
          }

          return {
            totalXp,
            totalCompletions,
            completionDates,
            unlockedBadgeIds,
            pendingBadge,
            lastXpGain: xp,
          }
        })
      },

      dismissBadgeModal: () => set({ pendingBadge: null }),

      getDailyStreak: () => calculateDailyStreak(get().completionDates),

      getWeeklyStreak: () => calculateWeeklyStreak(get().completionDates),

      getLevel: () => levelFromXp(get().totalXp),

      reset: () => set({ ...initialState }),
    }),
    {
      name: 'gamification-store',
      partialize: (s) => ({
        totalXp: s.totalXp,
        totalCompletions: s.totalCompletions,
        completionDates: s.completionDates,
        unlockedBadgeIds: s.unlockedBadgeIds,
      }),
    },
  ),
)

export function getUnlockedBadges() {
  const ids = useGamificationStore.getState().unlockedBadgeIds
  return ids.map((id) => getBadgeById(id)).filter(Boolean) as BadgeDefinition[]
}
