import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { fadeVariants } from '@/shared/motion/variants'
import { useTaskStore } from '@/store/useTaskStore'
import { generateBurndownData } from '../../lib/burndown'
import { aggregateCompletionTrend } from '../../lib/completionTrend'
import { computeInsights } from '../../lib/insights'
import { predictCompletionDays } from '../../lib/prediction'
import { BurnDownChart } from '../BurnDownChart'
import { CompletionTrendChart } from '../CompletionTrendChart'
import { InsightsCards } from '../InsightsCards'
import { PredictionCard } from '../PredictionCard'
import { TaskSkeleton } from '@/features/tasks/components/TaskSkeleton'

export function AnalyticsPage() {
  const { tasks, isLoading, initialize } = useTaskStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  const burndownData = useMemo(() => generateBurndownData(tasks), [tasks])
  const weeklyTrend = useMemo(() => aggregateCompletionTrend(tasks, 'weekly'), [tasks])
  const monthlyTrend = useMemo(() => aggregateCompletionTrend(tasks, 'monthly'), [tasks])
  const insights = useMemo(() => computeInsights(tasks), [tasks])
  const prediction = useMemo(() => predictCompletionDays(tasks), [tasks])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <TaskSkeleton count={2} />
        <TaskSkeleton count={2} />
      </div>
    )
  }

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
      data-testid="analytics-page"
    >
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Analytics</h2>
        <p className="text-sm text-[var(--text-muted)]">Track progress, trends, and predictions</p>
      </div>

      <InsightsCards insights={insights} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BurnDownChart data={burndownData} />
        </div>
        <PredictionCard prediction={prediction} />
      </div>

      <CompletionTrendChart weeklyData={weeklyTrend} monthlyData={monthlyTrend} />
    </motion.div>
  )
}
