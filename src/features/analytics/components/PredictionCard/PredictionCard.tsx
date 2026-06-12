import { motion } from 'framer-motion'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/Card'
import { AnimatedCounter } from '@/shared/components/AnimatedCounter'
import { fadeVariants } from '@/shared/motion/variants'
import type { CompletionPrediction } from '../../lib/prediction'

export interface PredictionCardProps {
  prediction: CompletionPrediction
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      data-testid="prediction-card"
    >
      <Card elevated className="border-[var(--accent)]/30 bg-[var(--accent)]/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📈</span>
            Completion Prediction
          </CardTitle>
          <CardDescription>{prediction.message}</CardDescription>
          {prediction.daysRemaining !== null && prediction.daysRemaining > 0 ? (
            <p className="mt-2 text-3xl font-bold text-[var(--accent)]">
              <AnimatedCounter value={prediction.daysRemaining} /> days
            </p>
          ) : null}
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Velocity: {prediction.velocity.toFixed(2)} tasks/day (7-day avg)
          </p>
        </CardHeader>
      </Card>
    </motion.div>
  )
}
