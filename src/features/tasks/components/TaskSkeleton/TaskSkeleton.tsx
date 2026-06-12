import { motion } from 'framer-motion'
import { fadeVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'

export interface TaskSkeletonProps {
  count?: number
}

function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)]',
        className,
      )}
    />
  )
}

export function TaskSkeleton({ count = 3 }: TaskSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: i * 0.1 }}
          className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4"
        >
          <SkeletonBar className="mb-3 h-4 w-3/4" />
          <SkeletonBar className="mb-2 h-3 w-full" />
          <SkeletonBar className="h-3 w-1/2" />
          <div className="mt-3 flex gap-2">
            <SkeletonBar className="h-5 w-16" />
            <SkeletonBar className="h-5 w-20" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
