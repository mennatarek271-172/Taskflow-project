import { motion } from 'framer-motion'
import { Badge } from '@/shared/components/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/Card'
import { AnimatedCounter } from '@/shared/components/AnimatedCounter'
import {
  fadeVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '@/shared/motion/variants'
import { BADGE_DEFINITIONS } from '../../constants/badges'
import { useGamificationStore } from '../../store/useGamificationStore'
import { StreakHeatmap } from '../StreakHeatmap'
import { XPProgressBar } from '../XPProgressBar'

export function GamificationWidget() {
  const totalXp = useGamificationStore((s) => s.totalXp)
  const totalCompletions = useGamificationStore((s) => s.totalCompletions)
  const unlockedBadgeIds = useGamificationStore((s) => s.unlockedBadgeIds)
  const dailyStreak = useGamificationStore((s) => s.getDailyStreak())
  const weeklyStreak = useGamificationStore((s) => s.getWeeklyStreak())
  const level = useGamificationStore((s) => s.getLevel())

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      data-testid="gamification-widget"
    >
      <Card elevated padding="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏆</span> Gamification
          </CardTitle>
          <CardDescription>XP, badges, and streaks</CardDescription>
        </CardHeader>

        <div className="mb-6 grid grid-cols-3 gap-4 text-center">
          <motion.div variants={staggerItemVariants}>
            <p className="text-2xl font-bold text-[var(--accent)]">
              <AnimatedCounter value={level} />
            </p>
            <p className="text-xs text-[var(--text-muted)]">Level</p>
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedCounter value={dailyStreak} />
            </p>
            <p className="text-xs text-[var(--text-muted)]">Day streak</p>
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              <AnimatedCounter value={weeklyStreak} />
            </p>
            <p className="text-xs text-[var(--text-muted)]">Week streak</p>
          </motion.div>
        </div>

        <motion.div variants={staggerItemVariants} className="mb-6">
          <XPProgressBar />
        </motion.div>

        <motion.div variants={staggerItemVariants} className="mb-6">
          <StreakHeatmap />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">
            Badges ({unlockedBadgeIds.length}/{BADGE_DEFINITIONS.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {BADGE_DEFINITIONS.map((badge) => {
              const unlocked = unlockedBadgeIds.includes(badge.id)
              return (
                <Badge
                  key={badge.id}
                  variant={unlocked ? 'primary' : 'default'}
                  className={!unlocked ? 'opacity-40' : ''}
                  title={badge.description}
                >
                  {unlocked ? badge.emoji : '🔒'} {badge.name}
                </Badge>
              )
            })}
          </div>
        </motion.div>

        <p className="mt-4 text-xs text-[var(--text-muted)]">
          {totalCompletions} tasks completed · {totalXp} XP earned
        </p>
      </Card>
    </motion.div>
  )
}
