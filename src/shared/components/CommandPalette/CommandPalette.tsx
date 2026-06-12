import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { getSafeTransition, getSafeVariants } from '@/shared/motion/motionConfig'
import { fadeVariants, scaleVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'
import type { Task } from '@/features/tasks/schemas/taskSchema'

export interface CommandAction {
  id: string
  label: string
  group: string
  shortcut?: string
  onSelect: () => void
}

export interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  actions: CommandAction[]
  tasks?: Task[]
  onTaskSelect?: (task: Task) => void
}

export function CommandPalette({
  isOpen,
  onClose,
  actions,
  tasks = [],
  onTaskSelect,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const reduced = useReducedMotion()

  const taskActions: CommandAction[] = useMemo(
    () =>
      tasks.slice(0, 8).map((task) => ({
        id: `task-${task.id}`,
        label: task.title,
        group: 'Tasks',
        onSelect: () => onTaskSelect?.(task),
      })),
    [tasks, onTaskSelect],
  )

  const allActions = useMemo(() => [...actions, ...taskActions], [actions, taskActions])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allActions
    return allActions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q),
    )
  }, [allActions, query])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setActiveIndex(0)
  }

  const handleClose = useCallback(() => {
    setQuery('')
    setActiveIndex(0)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault()
        filtered[activeIndex].onSelect()
        handleClose()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, filtered, activeIndex, handleClose])

  const grouped = useMemo(() => {
    const map = new Map<string, CommandAction[]>()
    for (const action of filtered) {
      const list = map.get(action.group) ?? []
      list.push(action)
      map.set(action.group, list)
    }
    return map
  }, [filtered])

  let flatIndex = 0

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center bg-[var(--overlay)] p-4 pt-[15vh]"
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
          data-testid="command-palette"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-[32rem] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-[var(--shadow-xl)]"
            variants={getSafeVariants(reduced, scaleVariants)}
            transition={getSafeTransition(reduced)}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Type a command or search tasks..."
              className="w-full border-b border-[var(--border-default)] bg-transparent px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
              data-testid="command-palette-input"
            />
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-[var(--text-muted)]">
                  No results found
                </p>
              ) : (
                [...grouped.entries()].map(([group, items]) => (
                  <div key={group} className="mb-2">
                    <p className="px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                      {group}
                    </p>
                    {items.map((action) => {
                      const index = flatIndex++
                      return (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => {
                            action.onSelect()
                            handleClose()
                          }}
                          className={cn(
                            'flex w-full items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-left text-sm',
                            index === activeIndex
                              ? 'bg-[var(--accent)] text-white'
                              : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
                          )}
                        >
                          <span>{action.label}</span>
                          {action.shortcut ? (
                            <kbd className="rounded bg-[var(--bg-tertiary)] px-1.5 py-0.5 text-xs opacity-70">
                              {action.shortcut}
                            </kbd>
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-[var(--border-default)] px-4 py-2 text-xs text-[var(--text-muted)]">
              ↑↓ navigate · Enter select · Esc close
            </div>
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-0 -z-10"
            variants={getSafeVariants(reduced, fadeVariants)}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
