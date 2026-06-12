import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders without errors', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('renders with variant', () => {
    render(<Badge variant="success">Done</Badge>)
    expect(screen.getByText('Done')).toBeInTheDocument()
  })
})
