import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buildTask } from '@/features/tasks/utils/taskUtils'
import { CommandPalette } from './CommandPalette'

const actions = [
  {
    id: 'new-task',
    label: 'New Task',
    group: 'Actions',
    onSelect: vi.fn(),
  },
]

describe('CommandPalette', () => {
  it('renders when open', () => {
    render(<CommandPalette isOpen onClose={vi.fn()} actions={actions} />)
    expect(screen.getByTestId('command-palette')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/type a command/i)).toBeInTheDocument()
  })

  it('filters actions by query', async () => {
    const user = userEvent.setup()
    render(<CommandPalette isOpen onClose={vi.fn()} actions={actions} />)
    await user.type(screen.getByTestId('command-palette-input'), 'new')
    expect(screen.getByText('New Task')).toBeInTheDocument()
  })

  it('calls onTaskSelect when task clicked', async () => {
    const user = userEvent.setup()
    const onTaskSelect = vi.fn()
    const task = buildTask({ title: 'My Task' })
    render(
      <CommandPalette
        isOpen
        onClose={vi.fn()}
        actions={[]}
        tasks={[task]}
        onTaskSelect={onTaskSelect}
      />,
    )
    await user.click(screen.getByText('My Task'))
    expect(onTaskSelect).toHaveBeenCalledWith(task)
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<CommandPalette isOpen onClose={onClose} actions={actions} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
