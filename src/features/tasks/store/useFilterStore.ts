import { create } from 'zustand'
import type { TaskPriority, TaskStatus } from '../schemas/taskSchema'

export interface TaskFilters {
  statuses: TaskStatus[]
  priorities: TaskPriority[]
  assignees: string[]
}

interface FilterState {
  searchInput: string
  filters: TaskFilters
  setSearchInput: (query: string) => void
  toggleStatus: (status: TaskStatus) => void
  togglePriority: (priority: TaskPriority) => void
  toggleAssignee: (assignee: string) => void
  clearFilters: () => void
}

const emptyFilters: TaskFilters = {
  statuses: [],
  priorities: [],
  assignees: [],
}

export const useFilterStore = create<FilterState>((set) => ({
  searchInput: '',
  filters: { ...emptyFilters },

  setSearchInput: (query) => set({ searchInput: query }),

  toggleStatus: (status) =>
    set((state) => {
      const statuses = state.filters.statuses.includes(status)
        ? state.filters.statuses.filter((s) => s !== status)
        : [...state.filters.statuses, status]
      return { filters: { ...state.filters, statuses } }
    }),

  togglePriority: (priority) =>
    set((state) => {
      const priorities = state.filters.priorities.includes(priority)
        ? state.filters.priorities.filter((p) => p !== priority)
        : [...state.filters.priorities, priority]
      return { filters: { ...state.filters, priorities } }
    }),

  toggleAssignee: (assignee) =>
    set((state) => {
      const assignees = state.filters.assignees.includes(assignee)
        ? state.filters.assignees.filter((a) => a !== assignee)
        : [...state.filters.assignees, assignee]
      return { filters: { ...state.filters, assignees } }
    }),

  clearFilters: () => set({ searchInput: '', filters: { ...emptyFilters } }),
}))
