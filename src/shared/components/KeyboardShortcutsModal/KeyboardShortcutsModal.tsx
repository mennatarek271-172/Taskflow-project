import { Modal } from '@/shared/components/Modal'
import { SHORTCUTS } from '@/shared/constants/shortcuts'

export interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORIES = ['general', 'navigation', 'tasks'] as const

const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  general: 'General',
  navigation: 'Navigation',
  tasks: 'Tasks',
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="md">
      <div className="space-y-4" data-testid="shortcuts-modal">
        {CATEGORIES.map((category) => (
          <div key={category}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              {CATEGORY_LABELS[category]}
            </h3>
            <ul className="space-y-2">
              {SHORTCUTS.filter((s) => s.category === category).map((shortcut) => (
                <li key={shortcut.id} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">{shortcut.label}</span>
                  <kbd className="rounded border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-2 py-0.5 font-mono text-xs text-[var(--text-primary)]">
                    {shortcut.keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Modal>
  )
}
