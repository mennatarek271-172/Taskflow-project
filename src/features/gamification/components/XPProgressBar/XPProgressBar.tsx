import { motion } from 'framer-motion'
import { xpProgressInLevel } from '../../constants/xp'
import { useGamificationStore } from '../../store/useGamificationStore'

export function XPProgressBar() {
  const totalXp = useGamificationStore((s) => s.totalXp)
  const level = useGamificationStore((s) => s.getLevel())
  const { current, max, percent } = xpProgressInLevel(totalXp)

  return (
    <div className="w-full" data-testid="xp-progress-bar">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--text-primary)]">Level {level}</span>
        <span className="text-[var(--text-muted)]">
          {current} / {max} XP
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-[var(--radius-full)] bg-[var(--bg-tertiary)]">
        <motion.div
          className="h-full rounded-[var(--radius-full)] bg-gradient-to-r from-[var(--accent)] to-[var(--color-primary-400)]"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{totalXp} total XP</p>
    </div>
  )
}
