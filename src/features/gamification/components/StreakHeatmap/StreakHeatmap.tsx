import { motion } from 'framer-motion'
import { cn } from '@/shared/utils/cn'
import { fadeVariants } from '@/shared/motion/variants'
import { buildStreakHeatmap } from '../../lib/streakCalculator'
import { useGamificationStore } from '../../store/useGamificationStore'

const LEVEL_COLORS = [
  'bg-[var(--bg-tertiary)]',
  'bg-[var(--color-primary-200)]',
  'bg-[var(--color-primary-300)]',
  'bg-[var(--color-primary-400)]',
  'bg-[var(--accent)]',
]

export function StreakHeatmap() {
  const completionDates = useGamificationStore((s) => s.completionDates)
  const cells = buildStreakHeatmap(completionDates, 12)

  const weeks: (typeof cells)[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      data-testid="streak-heatmap"
    >
      <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">Last 12 weeks</p>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell) => (
              <div
                key={cell.date}
                title={`${cell.date}: ${cell.count} task${cell.count !== 1 ? 's' : ''}`}
                className={cn('h-3 w-3 rounded-sm', LEVEL_COLORS[cell.level])}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1 text-xs text-[var(--text-muted)]">
        <span>Less</span>
        {LEVEL_COLORS.map((color, i) => (
          <div key={i} className={cn('h-3 w-3 rounded-sm', color)} />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  )
}
