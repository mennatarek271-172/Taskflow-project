import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CompletionTrendChart } from './CompletionTrendChart'

vi.mock('recharts', async () => {
  const actual = await vi.importActual<typeof import('recharts')>('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 400, height: 300 }}>{children}</div>
    ),
  }
})

const sampleData = [{ key: '2026-06', label: 'Jun 2026', completed: 2, created: 3 }]

describe('CompletionTrendChart', () => {
  it('renders without errors', () => {
    const { container } = render(
      <CompletionTrendChart weeklyData={sampleData} monthlyData={sampleData} />,
    )
    expect(container.querySelector('[data-testid="completion-trend-chart"]')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
