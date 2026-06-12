export interface BadgeDefinition {
  id: string
  name: string
  description: string
  emoji: string
  tier: 'bronze' | 'silver' | 'gold' | 'master' | 'special'
}

export interface GamificationStats {
  totalXp: number
  totalCompletions: number
  dailyStreak: number
  weeklyStreak: number
  unlockedBadgeIds: string[]
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first task',
    emoji: '🌱',
    tier: 'special',
  },
  {
    id: 'bronze',
    name: 'Bronze',
    description: 'Earn 100 XP',
    emoji: '🥉',
    tier: 'bronze',
  },
  {
    id: 'silver',
    name: 'Silver',
    description: 'Earn 500 XP',
    emoji: '🥈',
    tier: 'silver',
  },
  {
    id: 'gold',
    name: 'Gold',
    description: 'Earn 1,000 XP',
    emoji: '🥇',
    tier: 'gold',
  },
  {
    id: 'productivity_master',
    name: 'Productivity Master',
    description: 'Earn 2,500 XP',
    emoji: '👑',
    tier: 'master',
  },
  {
    id: 'streak_3',
    name: 'On a Roll',
    description: '3-day completion streak',
    emoji: '🔥',
    tier: 'bronze',
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7-day completion streak',
    emoji: '⚡',
    tier: 'silver',
  },
  {
    id: 'tasks_10',
    name: 'Getting Started',
    description: 'Complete 10 tasks',
    emoji: '✅',
    tier: 'bronze',
  },
  {
    id: 'tasks_50',
    name: 'Task Machine',
    description: 'Complete 50 tasks',
    emoji: '🚀',
    tier: 'gold',
  },
]

export function checkBadgeUnlock(badgeId: string, stats: GamificationStats): boolean {
  switch (badgeId) {
    case 'first_steps':
      return stats.totalCompletions >= 1
    case 'bronze':
      return stats.totalXp >= 100
    case 'silver':
      return stats.totalXp >= 500
    case 'gold':
      return stats.totalXp >= 1000
    case 'productivity_master':
      return stats.totalXp >= 2500
    case 'streak_3':
      return stats.dailyStreak >= 3
    case 'streak_7':
      return stats.dailyStreak >= 7
    case 'tasks_10':
      return stats.totalCompletions >= 10
    case 'tasks_50':
      return stats.totalCompletions >= 50
    default:
      return false
  }
}

export function getNewlyUnlockedBadges(stats: GamificationStats): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter(
    (badge) => !stats.unlockedBadgeIds.includes(badge.id) && checkBadgeUnlock(badge.id, stats),
  )
}

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.id === id)
}
