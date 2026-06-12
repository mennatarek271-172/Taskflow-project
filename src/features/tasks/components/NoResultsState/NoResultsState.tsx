import { motion } from 'framer-motion'
import { Button } from '@/shared/components/Button'
import { fadeVariants } from '@/shared/motion/variants'
import { useFilterStore } from '../../store/useFilterStore'

export function NoResultsState() {
  const clearFilters = useFilterStore((s) => s.clearFilters)

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-[var(--bg-secondary)] px-6 py-16 text-center"
      data-testid="no-results"
    >
      <span className="mb-3 text-4xl" role="img" aria-hidden="true">
        🔍
      </span>
      <h3 className="text-base font-semibold text-[var(--text-primary)]">No results found</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
        No tasks match your search or filters. Try adjusting your criteria.
      </p>
      <Button variant="secondary" size="sm" className="mt-4" onClick={clearFilters}>
        Clear all filters
      </Button>
    </motion.div>
  )
}
