import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  it('returns false by default in tests', () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('updates when media query changes', () => {
    let handler: ((e: MediaQueryListEvent) => void) | null = null
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
        handler = cb
      },
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)

    act(() => {
      handler?.({ matches: true } as MediaQueryListEvent)
    })
    expect(result.current).toBe(true)
  })
})
