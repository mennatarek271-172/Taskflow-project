import { motion } from 'framer-motion'
import { Button } from '@/shared/components/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/Card'
import { fadeVariants } from '@/shared/motion/variants'
import type { RecommendationResult } from '@/features/tasks/lib/recommendEngine'

export interface RecommendedTaskWidgetProps {
  recommendation: RecommendationResult | null
  onStart: (taskId: string) => void
  onView: (taskId: string) => void
}

export function RecommendedTaskWidget({
  recommendation,
  onStart,
  onView,
}: RecommendedTaskWidgetProps) {
  if (!recommendation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Task</CardTitle>
          <CardDescription>Complete or add tasks to get recommendations</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const { task, reasons } = recommendation

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      data-testid="recommended-task"
    >
      <Card elevated>
        <CardHeader>
          <CardTitle>Recommended Next Task</CardTitle>
          <CardDescription>Based on your mood, priority, and deadlines</CardDescription>
        </CardHeader>
        <p className="mb-3 text-base font-semibold text-[var(--text-primary)]">{task.title}</p>
        <div className="mb-4 space-y-1">
          <p className="text-xs font-medium text-[var(--text-muted)]">Why this task?</p>
          <ul className="space-y-1">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
              >
                <span className="text-[var(--accent)]">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onStart(task.id)}>
            Focus on this
          </Button>
          <Button size="sm" variant="secondary" onClick={() => onView(task.id)}>
            View details
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
