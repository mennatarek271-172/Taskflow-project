import type { Task } from '../schemas/taskSchema'
import { isOverdue } from '../utils/dateUtils'

export type RiskType = 'overdue' | 'stale' | 'due_soon' | 'overload'
export type RiskSeverity = 'low' | 'medium' | 'high'

export interface RiskAlert {
  id: string
  type: RiskType
  severity: RiskSeverity
  message: string
  taskId?: string
  taskTitle?: string
}

const STALE_DAYS = 7
const DUE_SOON_DAYS = 2
const OVERLOAD_THRESHOLD = 4

function daysSince(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

function daysUntil(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function detectTaskRisks(task: Task): RiskAlert[] {
  const alerts: RiskAlert[] = []

  if (task.status === 'done') return alerts

  if (isOverdue(task.dueDate, task.status)) {
    alerts.push({
      id: `overdue-${task.id}`,
      type: 'overdue',
      severity: 'high',
      message: `"${task.title}" is overdue`,
      taskId: task.id,
      taskTitle: task.title,
    })
  } else if (task.dueDate) {
    const days = daysUntil(task.dueDate)
    if (days >= 0 && days <= DUE_SOON_DAYS) {
      alerts.push({
        id: `due-soon-${task.id}`,
        type: 'due_soon',
        severity: days === 0 ? 'high' : 'medium',
        message: `"${task.title}" is due ${days === 0 ? 'today' : `in ${days} day${days > 1 ? 's' : ''}`}`,
        taskId: task.id,
        taskTitle: task.title,
      })
    }
  }

  const staleDays = daysSince(task.updatedAt)
  if (staleDays >= STALE_DAYS) {
    alerts.push({
      id: `stale-${task.id}`,
      type: 'stale',
      severity: staleDays >= 14 ? 'medium' : 'low',
      message: `"${task.title}" hasn't been updated in ${staleDays} days`,
      taskId: task.id,
      taskTitle: task.title,
    })
  }

  return alerts
}

export function detectWorkloadRisk(inProgressCount: number): RiskAlert | null {
  if (inProgressCount < OVERLOAD_THRESHOLD) return null
  return {
    id: 'overload',
    type: 'overload',
    severity: inProgressCount >= 6 ? 'high' : 'medium',
    message: `You have ${inProgressCount} tasks in progress — consider focusing on fewer`,
  }
}

export function detectAllRisks(tasks: Task[]): RiskAlert[] {
  const taskAlerts = tasks.flatMap(detectTaskRisks)
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length
  const overload = detectWorkloadRisk(inProgress)
  const all = overload ? [...taskAlerts, overload] : taskAlerts

  const severityOrder: Record<RiskSeverity, number> = { high: 0, medium: 1, low: 2 }
  return all.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
}

export function getNeedsAttentionTasks(tasks: Task[]): Task[] {
  const riskTaskIds = new Set(
    detectAllRisks(tasks)
      .filter((r) => r.taskId)
      .map((r) => r.taskId as string),
  )
  return tasks.filter((t) => riskTaskIds.has(t.id))
}
