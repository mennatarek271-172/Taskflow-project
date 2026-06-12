import { motion } from 'framer-motion'
import { fadeVariants } from '@/shared/motion/variants'
import { Button } from '@/shared/components/Button'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  icon = '📋',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-[var(--bg-secondary)] px-6 py-10 text-center"
    >
      <span className="mb-3 text-4xl" role="img" aria-hidden="true">
        {icon}
      </span>
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-xs text-xs text-[var(--text-muted)]">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </motion.div>
  )
}
