import { motion, type HTMLMotionProps } from 'framer-motion'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { getSafeTransition, getSafeVariants } from './motionConfig'
import type { Variants } from 'framer-motion'

export interface MotionDivProps extends HTMLMotionProps<'div'> {
  variants?: Variants
}

export function MotionDiv({ variants, transition, initial, animate, ...props }: MotionDivProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      variants={variants ? getSafeVariants(reduced, variants) : undefined}
      initial={reduced ? false : initial}
      animate={animate}
      transition={
        transition
          ? getSafeTransition(reduced, transition as Parameters<typeof getSafeTransition>[1])
          : getSafeTransition(reduced)
      }
      {...props}
    />
  )
}
