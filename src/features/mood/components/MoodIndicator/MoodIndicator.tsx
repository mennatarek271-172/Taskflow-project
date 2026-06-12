import { Badge } from '@/shared/components/Badge'
import { getTodayDateKey, MOOD_CONFIG } from '../../constants/moodConfig'
import { useMoodStore } from '../../store/useMoodStore'

export function MoodIndicator() {
  const mood = useMoodStore((s) => {
    const date = getTodayDateKey()
    return s.entries.find((e) => e.date === date)?.mood ?? null
  })

  if (!mood) return null

  const config = MOOD_CONFIG[mood]

  return (
    <Badge variant="primary" data-testid="mood-indicator">
      {config.emoji} {config.label}
    </Badge>
  )
}
