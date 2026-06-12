import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal'
import { scaleVariants } from '@/shared/motion/variants'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { fireConfetti } from '../../lib/confetti'
import { useGamificationStore } from '../../store/useGamificationStore'

export function BadgeUnlockModal() {
  const pendingBadge = useGamificationStore((s) => s.pendingBadge)
  const dismissBadgeModal = useGamificationStore((s) => s.dismissBadgeModal)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (pendingBadge) fireConfetti(reducedMotion)
  }, [pendingBadge, reducedMotion])

  return (
    <Modal
      isOpen={!!pendingBadge}
      onClose={dismissBadgeModal}
      title="Badge Unlocked!"
      size="sm"
      showCloseButton={false}
    >
      {pendingBadge ? (
        <motion.div
          variants={scaleVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center py-4 text-center"
          data-testid="badge-unlock-modal"
        >
          <motion.span
            className="mb-4 text-6xl"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
          >
            {pendingBadge.emoji}
          </motion.span>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{pendingBadge.name}</h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{pendingBadge.description}</p>
          <Button className="mt-6" onClick={dismissBadgeModal}>
            Awesome!
          </Button>
        </motion.div>
      ) : null}
    </Modal>
  )
}
