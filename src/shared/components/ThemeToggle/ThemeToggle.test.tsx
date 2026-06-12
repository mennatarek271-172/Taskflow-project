import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAppStore } from '@/store/useAppStore'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    useAppStore.setState({ theme: 'light' })
    document.documentElement.setAttribute('data-theme', 'light')
  })

  it('renders without errors', () => {
    render(<ThemeToggle />)
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('toggles theme and persists to localStorage', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByTestId('theme-toggle'))

    expect(useAppStore.getState().theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    const stored = localStorage.getItem('app-store')
    expect(stored).toBeTruthy()
    expect(stored).toContain('"theme":"dark"')
  })
})
