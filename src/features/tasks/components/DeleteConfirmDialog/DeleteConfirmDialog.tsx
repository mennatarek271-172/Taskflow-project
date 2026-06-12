import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal'
import { fadeVariants } from '@/shared/motion/variants'

export interface DeleteConfirmDialogProps {
  isOpen: boolean
  taskTitle: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function DeleteConfirmDialog({
  isOpen,
  taskTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    await new Promise((r) => setTimeout(r, 300))
    await onConfirm()
    setIsDeleting(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Delete task?"
      description={`"${taskTitle}" will be permanently removed.`}
      size="sm"
    >
      <motion.div variants={fadeVariants} initial="hidden" animate="visible" className="space-y-4">
        <p className="text-sm text-[var(--text-secondary)]">
          This action cannot be undone. The task will animate out before being removed.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </motion.div>
    </Modal>
  )
}
