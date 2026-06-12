import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders when open', () => {
    render(<Modal isOpen onClose={vi.fn()} title="Test Modal" />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<Modal isOpen={false} onClose={vi.fn()} title="Hidden" />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal isOpen onClose={onClose} title="Close Test" />)
    await user.click(screen.getByLabelText('Close modal'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
