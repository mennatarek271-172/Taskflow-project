import { useState, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: TooltipPosition
  delay?: number
}

const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            role="tooltip"
            className={cn(
              'pointer-events-none absolute z-50 whitespace-nowrap rounded-[var(--radius-md)]',
              'bg-[var(--text-primary)] px-2.5 py-1.5 text-xs text-[var(--bg-primary)]',
              'shadow-[var(--shadow-md)]',
              positionStyles[position],
            )}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {content}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
