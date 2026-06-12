import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

function fireKey(key: string, opts: Partial<KeyboardEventInit> = {}) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }))
}

describe('useKeyboardShortcuts', () => {
  it('triggers command palette on Ctrl+K', () => {
    const onCommandPalette = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onCommandPalette }))
    fireKey('k', { ctrlKey: true })
    expect(onCommandPalette).toHaveBeenCalledOnce()
  })

  it('triggers new task on N when not in input', () => {
    const onNewTask = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onNewTask }))
    fireKey('n')
    expect(onNewTask).toHaveBeenCalledOnce()
  })

  it('triggers go board on G then B', () => {
    const onGoBoard = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onGoBoard }))
    fireKey('g')
    fireKey('b')
    expect(onGoBoard).toHaveBeenCalledOnce()
  })
})
