import { AnimatePresence, motion } from 'framer-motion'
import { fadeVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'
import { useToastStore } from '@/shared/store/useToastStore'

const SEVERITY_STYLES = {
  high: 'border-[var(--color-danger-500)] bg-[var(--color-danger-500)] text-white',
  medium: 'border-[var(--color-warning-500)] bg-[var(--color-warning-500)] text-white',
  low: 'border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-primary)]',
}

const VARIANT_STYLES = {
  gamification: 'border-[var(--accent)] bg-[var(--accent)] text-white',
  risk: '',
  default: '',
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
      data-testid="toast-container"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'pointer-events-auto flex items-center gap-2 rounded-[var(--radius-md)] border px-4 py-3 text-sm shadow-[var(--shadow-lg)]',
              toast.variant === 'gamification'
                ? VARIANT_STYLES.gamification
                : SEVERITY_STYLES[toast.severity],
            )}
          >
            <span>
              {toast.variant === 'gamification' ? '🏆 ' : ''}
              {toast.message}
            </span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-2 opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
