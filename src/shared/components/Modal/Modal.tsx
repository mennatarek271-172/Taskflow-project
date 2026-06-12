import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { fadeVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/shared/components/Button'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  showCloseButton?: boolean
}

/** Explicit rem widths — do not use max-w-lg etc. (spacing scale maps lg → 1.5rem in our @theme). */
const sizeStyles = {
  sm: 'w-full max-w-[24rem]',
  md: 'w-full max-w-[28rem]',
  lg: 'w-full max-w-[32rem]',
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="modal-root"
          className="fixed inset-0 z-50"
          role="presentation"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--overlay)]"
            onClick={onClose}
            aria-label="Dismiss modal"
            tabIndex={-1}
          />

          <div className="relative z-10 flex h-full w-full items-center justify-center overflow-y-auto p-4 sm:p-6">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              aria-describedby={description ? 'modal-description' : undefined}
              className={cn(
                'shrink-0 rounded-[var(--radius-xl)] border border-[var(--border-default)]',
                'bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-xl)]',
                'max-h-[calc(100dvh-2rem)] overflow-y-auto',
                sizeStyles[size],
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {title ? (
                    <h2 id="modal-title" className="text-lg font-semibold text-[var(--text-primary)]">
                      {title}
                    </h2>
                  ) : null}
                  {description ? (
                    <p id="modal-description" className="mt-1 text-sm text-[var(--text-secondary)]">
                      {description}
                    </p>
                  ) : null}
                </div>
                {showCloseButton ? (
                  <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
                    ✕
                  </Button>
                ) : null}
              </div>
              <div className="w-full">{children}</div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
