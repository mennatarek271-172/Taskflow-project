import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { memo } from 'react'
import { cn } from '@/shared/utils/cn'
import type { Task } from '../../schemas/taskSchema'
import { TaskCard } from '../TaskCard'

export interface DraggableTaskCardProps {
  task: Task
  onClick?: () => void
  onDelete?: () => void
  isDragOverlay?: boolean
}

export const DraggableTaskCard = memo(function DraggableTaskCard({
  task,
  onClick,
  onDelete,
  isDragOverlay = false,
}: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task, status: task.status },
    disabled: isDragOverlay,
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform), zIndex: isDragging ? 50 : undefined }
    : undefined

  if (isDragOverlay) {
    return (
      <TaskCard
        task={task}
        layoutId={`overlay-${task.id}`}
        className="rotate-2 shadow-[var(--shadow-xl)]"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('touch-none', isDragging && 'opacity-40')}
      {...listeners}
      {...attributes}
    >
      <TaskCard
        task={task}
        layoutId={task.id}
        onClick={onClick}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  )
})
