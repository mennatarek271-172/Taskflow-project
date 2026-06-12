import { describe, expect, it } from 'vitest'
import {
  fadeVariants,
  motionTokens,
  scaleVariants,
  slideUpVariants,
  staggerContainerVariants,
} from './variants'

describe('motion variants', () => {
  it('exports design tokens', () => {
    expect(motionTokens.duration.normal).toBe(0.25)
    expect(motionTokens.ease.default).toEqual([0.4, 0, 0.2, 1])
  })

  it('defines fade, scale, slide, and stagger variants', () => {
    expect(fadeVariants.hidden).toEqual({ opacity: 0 })
    expect(scaleVariants.visible).toMatchObject({ opacity: 1, scale: 1 })
    expect(slideUpVariants.hidden).toMatchObject({ opacity: 0, y: 16 })
    expect(staggerContainerVariants.visible).toHaveProperty('transition.staggerChildren')
  })
})
