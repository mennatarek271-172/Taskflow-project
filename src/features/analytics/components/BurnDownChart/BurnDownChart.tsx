import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/Card'
import type { BurndownPoint } from '../../lib/burndown'

export interface BurnDownChartProps {
  data: BurndownPoint[]
}

export function BurnDownChart({ data }: BurnDownChartProps) {
  return (
    <Card elevated data-testid="burndown-chart">
      <CardHeader>
        <CardTitle>Burn Down</CardTitle>
        <CardDescription>Remaining work vs ideal progress (last 14 days)</CardDescription>
      </CardHeader>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="ideal"
              name="Ideal"
              stroke="var(--text-muted)"
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="var(--accent)"
              dot={{ r: 3 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
