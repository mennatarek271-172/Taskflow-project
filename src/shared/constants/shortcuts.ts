export interface ShortcutDefinition {
  id: string
  keys: string
  label: string
  category: 'navigation' | 'tasks' | 'general'
}

export const SHORTCUTS: ShortcutDefinition[] = [
  { id: 'command-palette', keys: 'Ctrl+K', label: 'Open command palette', category: 'general' },
  { id: 'shortcuts-help', keys: '?', label: 'Keyboard shortcuts', category: 'general' },
  { id: 'new-task', keys: 'N', label: 'New task', category: 'tasks' },
  { id: 'board', keys: 'G then B', label: 'Go to board', category: 'navigation' },
  { id: 'analytics', keys: 'G then A', label: 'Go to analytics', category: 'navigation' },
  { id: 'toggle-theme', keys: 'T', label: 'Toggle theme', category: 'general' },
  { id: 'search', keys: '/', label: 'Focus search', category: 'tasks' },
  { id: 'escape', keys: 'Esc', label: 'Close modal / palette', category: 'general' },
]
