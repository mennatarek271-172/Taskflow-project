import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/shared/components/Badge'
import { Card, CardHeader, CardTitle } from '@/shared/components/Card'
import {
  fadeVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '@/shared/motion/variants'
import type { Task } from '@/features/tasks/schemas/taskSchema'
import { PRIORITY_COLORS } from '@/features/tasks/utils/taskUtils'

export interface NeedsAttentionSectionProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function NeedsAttentionSection({ tasks, onTaskClick }: NeedsAttentionSectionProps) {
  if (tasks.length === 0) return null

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      data-testid="needs-attention"
    >
      <Card className="border-[var(--color-warning-500)]/30 bg-[var(--color-warning-500)]/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⚠️</span> Needs Attention
            <Badge variant="warning">{tasks.length}</Badge>
          </CardTitle>
        </CardHeader>
        <motion.ul
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <AnimatePresence>
            {tasks.slice(0, 5).map((task) => (
              <motion.li key={task.id} variants={staggerItemVariants}>
                <button
                  type="button"
                  onClick={() => onTaskClick(task)}
                  className="flex w-full items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-2 text-left hover:border-[var(--accent)]"
                >
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {task.title}
                  </span>
                  <Badge variant={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </Card>
    </motion.div>
  )
}
