import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders initials without errors', () => {
    render(<Avatar name="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders image when src provided', () => {
    render(<Avatar src="/test.png" alt="Test User" name="Test User" />)
    expect(screen.getByRole('img', { name: 'Test User' })).toBeInTheDocument()
  })
})
