import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { taskRepository } from '@/lib/repository/taskRepository'
import { useTaskStore } from '@/store/useTaskStore'

describe('App smoke test', () => {
  beforeEach(() => {
    localStorage.clear()
    taskRepository.setAll([])
    useTaskStore.setState({ tasks: [], isLoading: false })
  })

  it('renders without errors', async () => {
    render(<App />)
    expect(screen.getByText('TaskFlow')).toBeInTheDocument()
    expect(screen.getByText('Productivity Suite')).toBeInTheDocument()
    expect(screen.getByText('v1.0.0')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Task Board')).toBeInTheDocument()
    })
  })
})
