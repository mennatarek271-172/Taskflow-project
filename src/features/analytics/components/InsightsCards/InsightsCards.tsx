import { motion } from 'framer-motion'
import { Badge } from '@/shared/components/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/Card'
import { AnimatedCounter } from '@/shared/components/AnimatedCounter'
import { staggerContainerVariants, staggerItemVariants } from '@/shared/motion/variants'
import type { AnalyticsInsights } from '../../lib/insights'

export interface InsightsCardsProps {
  insights: AnalyticsInsights
}

export function InsightsCards({ insights }: InsightsCardsProps) {
  const statusItems = [
    { label: 'To Do', value: insights.statusDistribution.todo, variant: 'default' as const },
    {
      label: 'In Progress',
      value: insights.statusDistribution.in_progress,
      variant: 'warning' as const,
    },
    { label: 'Done', value: insights.statusDistribution.done, variant: 'success' as const },
  ]

  const priorityItems = [
    { label: 'High', value: insights.priorityDistribution.high },
    { label: 'Medium', value: insights.priorityDistribution.medium },
    { label: 'Low', value: insights.priorityDistribution.low },
  ]

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      data-testid="insights-cards"
    >
      <motion.div variants={staggerItemVariants}>
        <Card elevated>
          <CardHeader>
            <CardTitle className="text-2xl">
              <AnimatedCounter value={insights.completedTasks} />
              <span className="text-base text-[var(--text-muted)]"> / {insights.totalTasks}</span>
            </CardTitle>
            <CardDescription>Tasks completed</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{insights.mostProductiveDay}</CardTitle>
            <CardDescription>
              Most productive day
              {insights.mostProductiveCount > 0 ? ` (${insights.mostProductiveCount} tasks)` : ''}
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Status distribution</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              {statusItems.map((item) => (
                <Badge key={item.label} variant={item.variant}>
                  {item.label}: {item.value}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Priority distribution</CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              {priorityItems.map((item) => (
                <Badge key={item.label} variant="default">
                  {item.label}: {item.value}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </motion.div>
  )
}
