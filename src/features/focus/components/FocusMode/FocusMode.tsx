import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/components/Card'
import { fadeVariants } from '@/shared/motion/variants'
import { useFocusStore } from '../../store/useFocusStore'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export interface FocusModeProps {
  taskId?: string
  taskTitle?: string
}

export function FocusMode({ taskId, taskTitle }: FocusModeProps) {
  const {
    phase,
    secondsRemaining,
    isRunning,
    taskTitle: focusTitle,
    totalFocusSeconds,
    startFocus,
    pause,
    resume,
    tick,
    stop,
    skipBreak,
  } = useFocusStore()

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [isRunning, tick])

  const displayTitle = focusTitle ?? taskTitle
  const isActive = phase !== 'idle'

  return (
    <motion.div variants={fadeVariants} initial="hidden" animate="visible" data-testid="focus-mode">
      <Card elevated>
        <CardHeader>
          <CardTitle>Focus Mode</CardTitle>
          <CardDescription>Pomodoro timer — 25 min work, 5 min break</CardDescription>
        </CardHeader>

        {isActive ? (
          <div className="text-center">
            <p className="mb-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
              {phase === 'work' ? 'Focus' : 'Break'}
            </p>
            <p className="mb-2 text-4xl font-bold tabular-nums text-[var(--text-primary)]">
              {formatTime(secondsRemaining)}
            </p>
            {displayTitle ? (
              <p className="mb-4 text-sm text-[var(--text-secondary)]">{displayTitle}</p>
            ) : null}
            <div className="flex justify-center gap-2">
              {isRunning ? (
                <Button size="sm" variant="secondary" onClick={pause}>
                  Pause
                </Button>
              ) : (
                <Button size="sm" onClick={resume}>
                  Resume
                </Button>
              )}
              {phase === 'break' ? (
                <Button size="sm" variant="ghost" onClick={skipBreak}>
                  Skip break
                </Button>
              ) : null}
              <Button size="sm" variant="danger" onClick={stop}>
                Stop
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-2 text-sm text-[var(--text-muted)]">
              Total focus time: {formatTime(totalFocusSeconds)}
            </p>
            {taskId && taskTitle ? (
              <Button size="sm" onClick={() => startFocus(taskId, taskTitle)}>
                Start 25-min focus
              </Button>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">
                Select a recommended task to start focusing
              </p>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
