import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'
import type { RiskAlert } from '@/features/tasks/lib/riskDetection'
import { useToastStore } from '@/shared/store/useToastStore'

const SEVERITY_STYLES = {
  high: 'border-[var(--color-danger-500)]/50 bg-[var(--color-danger-500)]/10 text-[var(--color-danger-500)]',
  medium:
    'border-[var(--color-warning-500)]/50 bg-[var(--color-warning-500)]/10 text-[var(--color-warning-500)]',
  low: 'border-[var(--border-strong)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
}

export interface RiskAlertBannerProps {
  alerts: RiskAlert[]
}

export function RiskAlertBanner({ alerts }: RiskAlertBannerProps) {
  const addToast = useToastStore((s) => s.addToast)
  const shownRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    for (const alert of alerts) {
      if (alert.severity === 'high' && !shownRef.current.has(alert.id)) {
        shownRef.current.add(alert.id)
        addToast(alert.message, alert.severity)
      }
    }
  }, [alerts, addToast])

  if (alerts.length === 0) return null

  return (
    <div className="space-y-2" data-testid="risk-alerts">
      <AnimatePresence>
        {alerts.slice(0, 3).map((alert) => (
          <motion.div
            key={alert.id}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2.5 text-sm font-medium',
              SEVERITY_STYLES[alert.severity],
            )}
          >
            <span>
              {alert.severity === 'high' ? '🔴' : alert.severity === 'medium' ? '🟡' : '🔵'}
            </span>
            {alert.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
