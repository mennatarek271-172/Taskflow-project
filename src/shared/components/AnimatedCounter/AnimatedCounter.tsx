import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export interface AnimatedCounterProps {
  value: number
  duration?: number
  className?: string
  suffix?: string
}

export function AnimatedCounter({
  value,
  duration = 0.8,
  className,
  suffix = '',
}: AnimatedCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (v) => Math.round(v))
  const [text, setText] = useState('0')

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    return display.on('change', (v) => setText(String(v)))
  }, [display])

  return (
    <motion.span className={className} data-testid="animated-counter">
      {text}
      {suffix}
    </motion.span>
  )
}
