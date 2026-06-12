import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MobileColumnTabs } from './MobileColumnTabs'

const counts = { todo: 3, in_progress: 1, done: 5 }

describe('MobileColumnTabs', () => {
  it('renders all column tabs with counts', () => {
    render(<MobileColumnTabs active="todo" counts={counts} onChange={vi.fn()} />)
    expect(screen.getByTestId('mobile-column-tabs')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onChange when tab clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MobileColumnTabs active="todo" counts={counts} onChange={onChange} />)
    await user.click(screen.getByRole('tab', { name: /in progress/i }))
    expect(onChange).toHaveBeenCalledWith('in_progress')
  })
})
