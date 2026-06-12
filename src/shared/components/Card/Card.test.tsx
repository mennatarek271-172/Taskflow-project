import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Card, CardDescription, CardHeader, CardTitle } from './Card'

describe('Card', () => {
  it('renders without errors', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
          <CardDescription>Description text</CardDescription>
        </CardHeader>
      </Card>,
    )
    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })
})
