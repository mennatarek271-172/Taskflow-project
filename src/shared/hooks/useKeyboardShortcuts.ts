import { useEffect, useRef } from 'react'

export interface ShortcutHandlers {
  onCommandPalette?: () => void
  onShortcutsHelp?: () => void
  onNewTask?: () => void
  onGoBoard?: () => void
  onGoAnalytics?: () => void
  onToggleTheme?: () => void
  onFocusSearch?: () => void
}

function isInputFocused(): boolean {
  const el = document.activeElement
  if (!el) return false
  const tag = el.tagName.toLowerCase()
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    el.getAttribute('contenteditable') === 'true'
  )
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const pendingGo = useRef<'g' | null>(null)
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const h = handlersRef.current
      const mod = e.ctrlKey || e.metaKey
      const inputFocused = isInputFocused()

      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        h.onCommandPalette?.()
        return
      }

      if (e.key === 'Escape') return

      if (inputFocused && e.key !== '?' && !mod) return

      if (e.key === '?' && !mod) {
        e.preventDefault()
        h.onShortcutsHelp?.()
        return
      }

      if (e.key.toLowerCase() === 'n' && !mod) {
        e.preventDefault()
        h.onNewTask?.()
        return
      }

      if (e.key.toLowerCase() === 't' && !mod) {
        e.preventDefault()
        h.onToggleTheme?.()
        return
      }

      if (e.key === '/' && !mod) {
        e.preventDefault()
        h.onFocusSearch?.()
        return
      }

      if (e.key.toLowerCase() === 'g' && !mod) {
        pendingGo.current = 'g'
        setTimeout(() => {
          pendingGo.current = null
        }, 1000)
        return
      }

      if (pendingGo.current === 'g') {
        pendingGo.current = null
        if (e.key.toLowerCase() === 'b') {
          e.preventDefault()
          h.onGoBoard?.()
        } else if (e.key.toLowerCase() === 'a') {
          e.preventDefault()
          h.onGoAnalytics?.()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
