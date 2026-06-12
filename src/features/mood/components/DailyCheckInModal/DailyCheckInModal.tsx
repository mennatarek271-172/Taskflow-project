import { useState } from 'react'
import { motion } from 'framer-motion'
import { Modal } from '@/shared/components/Modal'
import { staggerContainerVariants, staggerItemVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'
import { getTodayDateKey, MOOD_CONFIG, MOOD_TYPES } from '../../constants/moodConfig'
import type { MoodType } from '../../schemas/moodSchema'
import { useMoodStore } from '../../store/useMoodStore'

export function DailyCheckInModal() {
  const showCheckIn = useMoodStore((s) => {
    const date = getTodayDateKey()
    const hasToday = s.entries.some((e) => e.date === date)
    const dismissed = s.checkInDismissedDate === date
    return !hasToday && !dismissed
  })
  const setTodayMood = useMoodStore((s) => s.setTodayMood)
  const dismissCheckIn = useMoodStore((s) => s.dismissCheckIn)
  const [selected, setSelected] = useState<MoodType | null>(null)

  const handleConfirm = () => {
    if (selected) setTodayMood(selected)
  }

  return (
    <Modal
      isOpen={showCheckIn}
      onClose={dismissCheckIn}
      title="How are you feeling today?"
      description="Your mood helps us personalize task recommendations and board ordering."
      size="lg"
      showCloseButton
    >
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        data-testid="daily-check-in"
      >
        {MOOD_TYPES.map((mood) => {
          const config = MOOD_CONFIG[mood]
          const isSelected = selected === mood
          return (
            <motion.button
              key={mood}
              type="button"
              variants={staggerItemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelected(mood)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border p-4 transition-colors',
                'border-[var(--border-default)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]',
                isSelected &&
                  'border-[var(--accent)] bg-[var(--bg-tertiary)] ring-2 ring-[var(--accent)]',
              )}
              data-testid={`mood-option-${mood}`}
            >
              <motion.span
                className="text-3xl"
                animate={isSelected ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                {config.emoji}
              </motion.span>
              <span className="text-sm font-medium text-[var(--text-primary)]">{config.label}</span>
              <span className="text-center text-xs text-[var(--text-muted)]">
                {config.description}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={dismissCheckIn}
          className="px-4 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          Skip for now
        </button>
        <button
          type="button"
          disabled={!selected}
          onClick={handleConfirm}
          className="rounded-[var(--radius-md)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          data-testid="mood-confirm"
        >
          Start my day
        </button>
      </div>
    </Modal>
  )
}
