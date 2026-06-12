import type { Task, TaskPriority, TaskStatus } from '../schemas/taskSchema'
import type { TaskFilters } from '../store/useFilterStore'

export interface FilterCriteria {
  searchQuery: string
  filters: TaskFilters
}

function matchesSearch(task: Task, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const title = task.title.toLowerCase()
  const description = (task.description ?? '').toLowerCase()
  const assignee = (task.assignee ?? '').toLowerCase()

  return title.includes(q) || description.includes(q) || assignee.includes(q)
}

function matchesStatusFilter(task: Task, statuses: TaskStatus[]): boolean {
  if (statuses.length === 0) return true
  return statuses.includes(task.status)
}

function matchesPriorityFilter(task: Task, priorities: TaskPriority[]): boolean {
  if (priorities.length === 0) return true
  return priorities.includes(task.priority)
}

function matchesAssigneeFilter(task: Task, assignees: string[]): boolean {
  if (assignees.length === 0) return true
  if (!task.assignee) return false
  return assignees.includes(task.assignee)
}

export function filterTasks(tasks: Task[], criteria: FilterCriteria): Task[] {
  const { searchQuery, filters } = criteria

  return tasks.filter(
    (task) =>
      matchesSearch(task, searchQuery) &&
      matchesStatusFilter(task, filters.statuses) &&
      matchesPriorityFilter(task, filters.priorities) &&
      matchesAssigneeFilter(task, filters.assignees),
  )
}

export function getUniqueAssignees(tasks: Task[]): string[] {
  const assignees = new Set<string>()
  for (const task of tasks) {
    if (task.assignee?.trim()) assignees.add(task.assignee.trim())
  }
  return [...assignees].sort()
}

export function hasActiveFilters(criteria: FilterCriteria): boolean {
  const { searchQuery, filters } = criteria
  return (
    searchQuery.trim().length > 0 ||
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assignees.length > 0
  )
}
