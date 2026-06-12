import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buildTask } from '../../utils/taskUtils'
import { TaskForm } from './TaskForm'

describe('TaskForm', () => {
  it('renders without errors', () => {
    render(<TaskForm onSubmit={vi.fn()} />)
    expect(screen.getByTestId('task-form')).toBeInTheDocument()
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
  })

  it('submits valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TaskForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Title'), 'My new task')
    await user.click(screen.getByRole('button', { name: 'Create Task' }))

    await waitFor(() => {
      expect(onSubmit.mock.calls[0][0]).toEqual(expect.objectContaining({ title: 'My new task' }))
    })
  })

  it('shows validation error for empty title', async () => {
    const user = userEvent.setup()
    render(<TaskForm onSubmit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Create Task' }))
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })

  it('pre-fills when editing', () => {
    const task = buildTask({ title: 'Existing task' })
    render(<TaskForm task={task} onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Title')).toHaveValue('Existing task')
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })
})
