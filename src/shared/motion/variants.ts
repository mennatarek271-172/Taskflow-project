import type { Transition, Variants } from 'framer-motion'

/** Shared motion design tokens */
export const motionTokens = {
  duration: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,
  },
  ease: {
    default: [0.4, 0, 0.2, 1] as const,
    spring: [0.34, 1.56, 0.64, 1] as const,
    easeOut: [0, 0, 0.2, 1] as const,
    easeIn: [0.4, 0, 1, 1] as const,
  },
} as const

export const defaultTransition: Transition = {
  duration: motionTokens.duration.normal,
  ease: motionTokens.ease.default,
}

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    transition: { duration: motionTokens.duration.fast },
  },
}

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: motionTokens.duration.fast },
  },
}

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: motionTokens.duration.fast },
  },
}

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: motionTokens.duration.fast },
  },
}

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    x: -16,
    transition: { duration: motionTokens.duration.fast },
  },
}

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    x: 16,
    transition: { duration: motionTokens.duration.fast },
  },
}

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: motionTokens.duration.fast },
  },
}

export const hoverElevation = {
  rest: { y: 0, boxShadow: 'var(--shadow-sm)' },
  hover: {
    y: -2,
    boxShadow: 'var(--shadow-md)',
    transition: { duration: motionTokens.duration.fast },
  },
}
