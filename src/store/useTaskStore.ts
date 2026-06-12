import { create } from 'zustand'
import type {
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskInput,
} from '@/features/tasks/schemas/taskSchema'
import { useGamificationStore } from '@/features/gamification/store/useGamificationStore'
import { buildTask, createActivityEntry } from '@/features/tasks/utils/taskUtils'
import { taskRepository } from '@/lib/repository/taskRepository'

function onTaskCompletedIfNeeded(previous: Task, updated: Task) {
  if (previous.status !== 'done' && updated.status === 'done') {
    useGamificationStore.getState().awardTaskCompletion(updated)
  }
}

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  initialize: () => void
  createTask: (input: CreateTaskInput) => Task
  updateTask: (id: string, input: UpdateTaskInput) => Task | undefined
  deleteTask: (id: string) => boolean
  moveTask: (id: string, status: TaskStatus) => Task | undefined
  getTaskById: (id: string) => Task | undefined
  getTasksByStatus: (status: TaskStatus) => Task[]
}

function touchTask(task: Task, updates: Partial<Task>, action: string, details?: string): Task {
  return {
    ...task,
    ...updates,
    updatedAt: new Date().toISOString(),
    activityLog: [...task.activityLog, createActivityEntry(action, details)],
  }
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: true,

  initialize: () => {
    const tasks = taskRepository.load()
    set({ tasks, isLoading: false })
  },

  createTask: (input) => {
    const task = buildTask(input)
    taskRepository.createAndSave(task)
    set({ tasks: taskRepository.getAll() })
    return task
  },

  updateTask: (id, input) => {
    const existing = taskRepository.getById(id)
    if (!existing) return undefined

    const updated = touchTask(
      existing,
      input,
      'updated',
      `Task "${input.title ?? existing.title}" updated`,
    )
    const result = taskRepository.updateAndSave(id, updated)
    if (result) {
      onTaskCompletedIfNeeded(existing, result)
      set({ tasks: taskRepository.getAll() })
    }
    return result
  },

  deleteTask: (id) => {
    const deleted = taskRepository.deleteAndSave(id)
    if (deleted) set({ tasks: taskRepository.getAll() })
    return deleted
  },

  moveTask: (id, status) => {
    const existing = taskRepository.getById(id)
    if (!existing || existing.status === status) return existing

    const updated = touchTask(existing, { status }, 'moved', `Moved to ${status.replace('_', ' ')}`)
    const result = taskRepository.updateAndSave(id, updated)
    if (result) {
      onTaskCompletedIfNeeded(existing, result)
      set({ tasks: taskRepository.getAll() })
    }
    return result
  },

  getTaskById: (id) => get().tasks.find((t) => t.id === id),

  getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),
}))
