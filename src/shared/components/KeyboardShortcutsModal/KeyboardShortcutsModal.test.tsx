import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'

describe('KeyboardShortcutsModal', () => {
  it('shows shortcut groups when open', () => {
    render(<KeyboardShortcutsModal isOpen onClose={vi.fn()} />)
    expect(screen.getByTestId('shortcuts-modal')).toBeInTheDocument()
    expect(screen.getByText('Open command palette')).toBeInTheDocument()
    expect(screen.getByText('Go to board')).toBeInTheDocument()
  })

  it('hides when closed', () => {
    render(<KeyboardShortcutsModal isOpen={false} onClose={vi.fn()} />)
    expect(screen.queryByTestId('shortcuts-modal')).not.toBeInTheDocument()
  })
})
