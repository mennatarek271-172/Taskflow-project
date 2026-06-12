import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buildTask } from '../../utils/taskUtils'
import { TaskCard } from './TaskCard'

describe('TaskCard', () => {
  const task = buildTask({
    title: 'Test Card',
    description: 'Description here',
    priority: 'high',
    tags: ['bug'],
    assignee: 'john',
  })

  it('renders without errors', () => {
    render(<TaskCard task={task} />)
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Description here')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('@john')).toBeInTheDocument()
  })

  it('shows overdue indicator', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const overdueTask = { ...task, dueDate: yesterday.toISOString().split('T')[0] }
    render(<TaskCard task={overdueTask} />)
    expect(screen.getByText(/⚠/)).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<TaskCard task={task} onClick={onClick} />)
    await user.click(screen.getByTestId(`task-card-${task.id}`))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
