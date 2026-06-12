import { useMemo } from 'react'
import { getTodayDateKey } from '@/features/mood/constants/moodConfig'
import { useMoodStore } from '@/features/mood/store/useMoodStore'
import { FocusMode } from '@/features/focus/components/FocusMode'
import { useFocusStore } from '@/features/focus/store/useFocusStore'
import { recommendNextTask } from '@/features/tasks/lib/recommendEngine'
import { detectAllRisks, getNeedsAttentionTasks } from '@/features/tasks/lib/riskDetection'
import type { Task } from '@/features/tasks/schemas/taskSchema'
import { NeedsAttentionSection } from '../NeedsAttentionSection'
import { RecommendedTaskWidget } from '../RecommendedTaskWidget'
import { RiskAlertBanner } from '../RiskAlertBanner'

export interface ProductivityPanelProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function ProductivityPanel({ tasks, onTaskClick }: ProductivityPanelProps) {
  const todayMood = useMoodStore((s) => {
    const date = getTodayDateKey()
    return s.entries.find((e) => e.date === date)?.mood ?? null
  })
  const startFocus = useFocusStore((s) => s.startFocus)

  const recommendation = useMemo(
    () => (todayMood ? recommendNextTask(tasks, todayMood) : recommendNextTask(tasks, 'focused')),
    [tasks, todayMood],
  )

  const risks = useMemo(() => detectAllRisks(tasks), [tasks])
  const attentionTasks = useMemo(() => getNeedsAttentionTasks(tasks), [tasks])

  return (
    <div className="space-y-4" data-testid="productivity-panel">
      <RiskAlertBanner alerts={risks} />
      <div className="grid gap-4 lg:grid-cols-3">
        <RecommendedTaskWidget
          recommendation={recommendation}
          onStart={(taskId) => {
            const task = tasks.find((t) => t.id === taskId)
            if (task) startFocus(task.id, task.title)
          }}
          onView={(taskId) => {
            const task = tasks.find((t) => t.id === taskId)
            if (task) onTaskClick(task)
          }}
        />
        <FocusMode taskId={recommendation?.task.id} taskTitle={recommendation?.task.title} />
        <NeedsAttentionSection tasks={attentionTasks} onTaskClick={onTaskClick} />
      </div>
    </div>
  )
}
