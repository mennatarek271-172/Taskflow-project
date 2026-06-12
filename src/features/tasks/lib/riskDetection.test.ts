import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { buildTask } from '../utils/taskUtils'
import {
  detectAllRisks,
  detectTaskRisks,
  detectWorkloadRisk,
  getNeedsAttentionTasks,
} from './riskDetection'

describe('riskDetection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('detects overdue tasks', () => {
    const task = buildTask({
      title: 'Late',
      status: 'todo',
      dueDate: '2026-06-10',
    })
    const risks = detectTaskRisks(task)
    expect(risks.some((r) => r.type === 'overdue')).toBe(true)
    expect(risks[0].severity).toBe('high')
  })

  it('detects due soon tasks', () => {
    const task = buildTask({
      title: 'Soon',
      status: 'todo',
      dueDate: '2026-06-16',
    })
    const risks = detectTaskRisks(task)
    expect(risks.some((r) => r.type === 'due_soon')).toBe(true)
  })

  it('detects workload overload', () => {
    const risk = detectWorkloadRisk(5)
    expect(risk?.type).toBe('overload')
    expect(risk?.severity).toBe('medium')
  })

  it('returns needs attention tasks', () => {
    const overdue = buildTask({ title: 'Late', status: 'todo', dueDate: '2026-06-01' })
    const fine = buildTask({ title: 'OK', status: 'todo' })
    const attention = getNeedsAttentionTasks([overdue, fine])
    expect(attention).toHaveLength(1)
    expect(attention[0].id).toBe(overdue.id)
  })

  it('sorts risks by severity', () => {
    const tasks = [
      buildTask({ title: 'Late', status: 'todo', dueDate: '2026-06-01' }),
      buildTask({ title: 'Soon', status: 'todo', dueDate: '2026-06-16' }),
    ]
    const risks = detectAllRisks(tasks)
    expect(risks[0].severity).toBe('high')
  })
})
