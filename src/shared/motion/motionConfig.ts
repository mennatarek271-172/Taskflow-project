import type { TargetAndTransition, Transition, Variants } from 'framer-motion'
import { defaultTransition, motionTokens } from './variants'

export const instantTransition: Transition = { duration: 0 }

export const instantVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: { opacity: 1 },
}

export function getSafeTransition(
  reduced: boolean,
  transition: Transition = defaultTransition,
): Transition {
  return reduced ? instantTransition : transition
}

export function getSafeVariants(reduced: boolean, variants: Variants): Variants {
  if (!reduced) return variants
  return instantVariants
}

export function getSafeDuration(
  reduced: boolean,
  duration: number = motionTokens.duration.normal,
): number {
  return reduced ? 0 : duration
}

export function getSafeHover(
  reduced: boolean,
  hover: TargetAndTransition,
): TargetAndTransition | undefined {
  return reduced ? undefined : hover
}
