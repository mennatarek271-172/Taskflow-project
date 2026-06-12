import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/shared/components/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/Card'
import type { TrendPeriod, TrendPoint } from '../../lib/completionTrend'

export interface CompletionTrendChartProps {
  weeklyData: TrendPoint[]
  monthlyData: TrendPoint[]
}

export function CompletionTrendChart({ weeklyData, monthlyData }: CompletionTrendChartProps) {
  const [period, setPeriod] = useState<TrendPeriod>('weekly')
  const data = period === 'weekly' ? weeklyData : monthlyData

  return (
    <Card elevated data-testid="completion-trend-chart">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle>Completion Trend</CardTitle>
            <CardDescription>Tasks created vs completed over time</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={period === 'weekly' ? 'primary' : 'ghost'}
              onClick={() => setPeriod('weekly')}
            >
              Weekly
            </Button>
            <Button
              size="sm"
              variant={period === 'monthly' ? 'primary' : 'ghost'}
              onClick={() => setPeriod('monthly')}
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
              }}
            />
            <Legend />
            <Bar
              dataKey="created"
              name="Created"
              fill="var(--color-primary-300)"
              radius={[4, 4, 0, 0]}
            />
            <Bar dataKey="completed" name="Completed" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
