import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders without errors', () => {
    render(<Input label="Email" placeholder="you@example.com" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Input label="Name" error="Required field" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required field')
  })
})
