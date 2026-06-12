import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/shared/components/Badge'
import { Button } from '@/shared/components/Button'
import { fadeVariants } from '@/shared/motion/variants'
import { useFilterStore } from '../../store/useFilterStore'
import { TASK_STATUS_LABELS } from '../../utils/taskUtils'

export function ActiveFilters() {
  const searchInput = useFilterStore((s) => s.searchInput)
  const filters = useFilterStore((s) => s.filters)
  const toggleStatus = useFilterStore((s) => s.toggleStatus)
  const togglePriority = useFilterStore((s) => s.togglePriority)
  const toggleAssignee = useFilterStore((s) => s.toggleAssignee)
  const clearFilters = useFilterStore((s) => s.clearFilters)

  const hasFilters =
    searchInput.trim().length > 0 ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assignees.length > 0

  if (!hasFilters) return null

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap items-center gap-2"
      data-testid="active-filters"
    >
      <span className="text-xs text-[var(--text-muted)]">Active:</span>
      <AnimatePresence mode="popLayout">
        {searchInput.trim() ? (
          <motion.span
            key="search"
            layout
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Badge variant="primary">Search: {searchInput}</Badge>
          </motion.span>
        ) : null}
        {filters.statuses.map((status) => (
          <motion.span
            key={status}
            layout
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button type="button" onClick={() => toggleStatus(status)}>
              <Badge variant="primary">{TASK_STATUS_LABELS[status]} ✕</Badge>
            </button>
          </motion.span>
        ))}
        {filters.priorities.map((priority) => (
          <motion.span
            key={priority}
            layout
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button type="button" onClick={() => togglePriority(priority)}>
              <Badge variant="warning">{priority} ✕</Badge>
            </button>
          </motion.span>
        ))}
        {filters.assignees.map((assignee) => (
          <motion.span
            key={assignee}
            layout
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button type="button" onClick={() => toggleAssignee(assignee)}>
              <Badge variant="default">@{assignee} ✕</Badge>
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Clear all
      </Button>
    </motion.div>
  )
}
