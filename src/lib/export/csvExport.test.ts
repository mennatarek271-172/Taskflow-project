import { describe, expect, it } from 'vitest'
import { buildTask } from '@/features/tasks/utils/taskUtils'
import { tasksToCsv } from './csvExport'

describe('csvExport', () => {
  it('exports tasks to CSV format', () => {
    const task = buildTask({
      title: 'Test, task',
      description: 'Hello "world"',
      tags: ['a', 'b'],
      priority: 'high',
    })
    const csv = tasksToCsv([task])
    expect(csv).toContain('title,description,status')
    expect(csv).toContain('"Test, task"')
    expect(csv).toContain('a;b')
  })

  it('handles empty list', () => {
    const csv = tasksToCsv([])
    expect(csv.split('\n')).toHaveLength(1)
  })
})
