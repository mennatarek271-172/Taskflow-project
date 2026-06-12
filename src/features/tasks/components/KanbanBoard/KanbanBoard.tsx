import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useReducedMotion } from '@/shared/hooks/useReducedMotion'
import { getSafeDuration, getSafeVariants } from '@/shared/motion/motionConfig'
import {
  fadeVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '@/shared/motion/variants'
import { getTodayDateKey } from '@/features/mood/constants/moodConfig'
import { sortTasksByMood } from '@/features/mood/lib/moodEngine'
import { useMoodStore } from '@/features/mood/store/useMoodStore'
import { GamificationWidget } from '@/features/gamification/components/GamificationWidget'
import { ProductivityPanel } from '@/features/productivity/components/ProductivityPanel'
import { useTaskStore } from '@/store/useTaskStore'
import type { CreateTaskInput, Task, TaskStatus } from '../../schemas/taskSchema'
import { filterTasks, getUniqueAssignees, hasActiveFilters } from '../../lib/taskSelectors'
import { resolveDragTaskId, resolveDropStatus, shouldMoveTask } from '../../lib/dndUtils'
import { useFilterStore } from '../../store/useFilterStore'
import { TASK_STATUS_ORDER } from '../../utils/taskUtils'
import { ActiveFilters } from '../ActiveFilters'
import { DeleteConfirmDialog } from '../DeleteConfirmDialog'
import { DraggableTaskCard } from '../DraggableTaskCard'
import { FilterPanel } from '../FilterPanel'
import { NoResultsState } from '../NoResultsState'
import { SearchBar } from '../SearchBar'
import { TaskDetailModal } from '../TaskDetailModal'
import { TaskForm } from '../TaskForm'
import { TaskSkeleton } from '../TaskSkeleton'
import { MobileColumnTabs } from './MobileColumnTabs'
import { KanbanColumn } from './KanbanColumn'

export interface KanbanBoardProps {
  externalSelectedTask?: Task | null
  onExternalTaskHandled?: () => void
}

export function KanbanBoard({
  externalSelectedTask = null,
  onExternalTaskHandled,
}: KanbanBoardProps = {}) {
  const { tasks, isLoading, initialize, createTask, updateTask, deleteTask, moveTask } =
    useTaskStore()

  const searchInput = useFilterStore((s) => s.searchInput)
  const filters = useFilterStore((s) => s.filters)
  const debouncedSearch = useDebounce(searchInput, 300)

  const filterCriteria = useMemo(
    () => ({ searchQuery: debouncedSearch, filters }),
    [debouncedSearch, filters],
  )

  const filteredTasks = useMemo(() => filterTasks(tasks, filterCriteria), [tasks, filterCriteria])

  const assignees = useMemo(() => getUniqueAssignees(tasks), [tasks])
  const filtersActive = hasActiveFilters(filterCriteria)

  const todayMood = useMoodStore((s) => {
    const date = getTodayDateKey()
    return s.entries.find((e) => e.date === date)?.mood ?? null
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set())
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [overColumn, setOverColumn] = useState<TaskStatus | null>(null)
  const [mobileColumn, setMobileColumn] = useState<TaskStatus>('todo')
  const reducedMotion = useReducedMotion()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const onNewTask = () => setCreateOpen(true)
    window.addEventListener('taskflow:new-task', onNewTask)
    return () => window.removeEventListener('taskflow:new-task', onNewTask)
  }, [])

  const externalTaskId = externalSelectedTask?.id ?? null
  useEffect(() => {
    if (!externalSelectedTask) return
    const task = externalSelectedTask
    queueMicrotask(() => {
      setDetailTask(task)
      setMobileColumn(task.status)
      onExternalTaskHandled?.()
    })
  }, [externalTaskId, externalSelectedTask, onExternalTaskHandled])

  const visibleTasks = filteredTasks.filter((t) => !exitingIds.has(t.id))

  const getColumnTasks = (status: TaskStatus) => {
    const columnTasks = visibleTasks.filter((t) => t.status === status)
    const mood = todayMood ?? 'focused'
    return sortTasksByMood(columnTasks, mood)
  }

  const columnCounts = {
    todo: visibleTasks.filter((t) => t.status === 'todo').length,
    in_progress: visibleTasks.filter((t) => t.status === 'in_progress').length,
    done: visibleTasks.filter((t) => t.status === 'done').length,
  }

  const handleCreate = (data: CreateTaskInput) => {
    createTask(data)
    setCreateOpen(false)
  }

  const handleUpdate = (data: CreateTaskInput) => {
    if (!editTask) return
    updateTask(editTask.id, data)
    setEditTask(null)
    if (detailTask?.id === editTask.id) {
      setDetailTask(useTaskStore.getState().getTaskById(editTask.id) ?? null)
    }
  }

  const handleDeleteRequest = (task: Task) => {
    setDeleteTarget(task)
    setDetailTask(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setExitingIds((prev) => new Set(prev).add(id))
    setDeleteTarget(null)
    await new Promise((r) => setTimeout(r, 350))
    deleteTask(id)
    setExitingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const handleMove = (task: Task, direction: 'prev' | 'next') => {
    const idx = TASK_STATUS_ORDER.indexOf(task.status)
    const newIdx = direction === 'next' ? idx + 1 : idx - 1
    if (newIdx < 0 || newIdx >= TASK_STATUS_ORDER.length) return
    const newStatus = TASK_STATUS_ORDER[newIdx]
    moveTask(task.id, newStatus)
    const updated = useTaskStore.getState().getTaskById(task.id)
    if (updated && detailTask?.id === task.id) setDetailTask(updated)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    setOverColumn(resolveDropStatus(event))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const taskId = resolveDragTaskId(event)
    const targetStatus = resolveDropStatus(event)
    const task = tasks.find((t) => t.id === taskId)

    setActiveTask(null)
    setOverColumn(null)

    if (!taskId || !task || !shouldMoveTask(task.status, targetStatus) || !targetStatus) return

    moveTask(taskId, targetStatus)
    if (detailTask?.id === taskId) {
      setDetailTask(useTaskStore.getState().getTaskById(taskId) ?? null)
    }
  }

  const handleDragCancel = () => {
    setActiveTask(null)
    setOverColumn(null)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <TaskSkeleton count={2} />
        <TaskSkeleton count={2} />
        <TaskSkeleton count={2} />
      </div>
    )
  }

  const noResults = filtersActive && visibleTasks.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Task Board</h2>
          <p className="text-sm text-[var(--text-muted)]">
            {visibleTasks.length} of {tasks.length} tasks shown
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ New Task</Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <SearchBar />
        <FilterPanel assignees={assignees} />
      </div>

      <ActiveFilters />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProductivityPanel tasks={tasks} onTaskClick={setDetailTask} />
        </div>
        <GamificationWidget />
      </div>

      {noResults ? (
        <NoResultsState />
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <MobileColumnTabs
            active={mobileColumn}
            counts={columnCounts}
            onChange={setMobileColumn}
          />

          <motion.div
            variants={getSafeVariants(reducedMotion, staggerContainerVariants)}
            initial={reducedMotion ? false : 'hidden'}
            animate="visible"
            className="mt-3 grid gap-4 md:mt-0 md:grid-cols-2 lg:grid-cols-3"
          >
            {TASK_STATUS_ORDER.map((status) => (
              <motion.div
                key={status}
                variants={getSafeVariants(reducedMotion, staggerItemVariants)}
                className={status !== mobileColumn ? 'hidden md:block' : ''}
              >
                <KanbanColumn
                  status={status}
                  tasks={getColumnTasks(status)}
                  isDropTarget={overColumn === status}
                  onTaskClick={setDetailTask}
                  onTaskDelete={handleDeleteRequest}
                  onCreateTask={() => setCreateOpen(true)}
                  showEmpty={!filtersActive}
                />
              </motion.div>
            ))}
          </motion.div>

          <DragOverlay
            dropAnimation={{
              duration: getSafeDuration(reducedMotion, 0.25) * 1000,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {activeTask ? <DraggableTaskCard task={activeTask} isDragOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Task" size="lg">
        <motion.div variants={fadeVariants} initial="hidden" animate="visible">
          <TaskForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
        </motion.div>
      </Modal>

      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task" size="lg">
        {editTask ? (
          <TaskForm task={editTask} onSubmit={handleUpdate} onCancel={() => setEditTask(null)} />
        ) : null}
      </Modal>

      <TaskDetailModal
        task={detailTask}
        isOpen={!!detailTask}
        onClose={() => setDetailTask(null)}
        onEdit={(task) => {
          setDetailTask(null)
          setEditTask(task)
        }}
        onDelete={handleDeleteRequest}
        onMovePrev={(task) => handleMove(task, 'prev')}
        onMoveNext={(task) => handleMove(task, 'next')}
        canMovePrev={detailTask ? TASK_STATUS_ORDER.indexOf(detailTask.status) > 0 : false}
        canMoveNext={
          detailTask
            ? TASK_STATUS_ORDER.indexOf(detailTask.status) < TASK_STATUS_ORDER.length - 1
            : false
        }
      />

      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        taskTitle={deleteTarget?.title ?? ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
