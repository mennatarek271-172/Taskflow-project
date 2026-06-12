import { describe, expect, it } from 'vitest'
import { fadeVariants } from './variants'
import {
  getSafeDuration,
  getSafeHover,
  getSafeTransition,
  getSafeVariants,
  instantVariants,
} from './motionConfig'

describe('motionConfig', () => {
  it('returns instant variants when reduced motion', () => {
    expect(getSafeVariants(true, fadeVariants)).toEqual(instantVariants)
    expect(getSafeVariants(false, fadeVariants)).toEqual(fadeVariants)
  })

  it('returns zero duration when reduced motion', () => {
    expect(getSafeDuration(true, 0.25)).toBe(0)
    expect(getSafeDuration(false, 0.25)).toBe(0.25)
  })

  it('disables hover when reduced motion', () => {
    expect(getSafeHover(true, { y: -2 })).toBeUndefined()
    expect(getSafeHover(false, { y: -2 })).toEqual({ y: -2 })
  })

  it('returns instant transition when reduced motion', () => {
    expect(getSafeTransition(true)).toEqual({ duration: 0 })
  })
})
