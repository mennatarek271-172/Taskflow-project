import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BurnDownChart } from './BurnDownChart'

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 400, height: 300 }}>{children}</div>
    ),
  }
})

const sampleData = [
  { date: '2026-06-10', label: 'Jun 10', ideal: 5, actual: 5, remaining: 5 },
  { date: '2026-06-11', label: 'Jun 11', ideal: 3, actual: 4, remaining: 4 },
]

describe('BurnDownChart', () => {
  it('renders without errors', () => {
    const { container } = render(<BurnDownChart data={sampleData} />)
    expect(container.querySelector('[data-testid="burndown-chart"]')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
