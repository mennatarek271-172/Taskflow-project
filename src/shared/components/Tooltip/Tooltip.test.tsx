import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '@/shared/components/Button'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('renders children without errors', () => {
    render(
      <Tooltip content="Help text">
        <Button>Hover me</Button>
      </Tooltip>,
    )
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument()
  })
})
