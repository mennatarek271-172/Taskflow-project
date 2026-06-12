import { describe, expect, it } from 'vitest'
import { buildTask } from '../utils/taskUtils'
import { filterTasks, getUniqueAssignees, hasActiveFilters } from './taskSelectors'

const tasks = [
  buildTask({
    title: 'Fix login bug',
    description: 'Auth flow broken',
    assignee: 'alice',
    status: 'todo',
    priority: 'high',
  }),
  buildTask({
    title: 'Design dashboard',
    description: 'UI mockups',
    assignee: 'bob',
    status: 'in_progress',
    priority: 'medium',
  }),
  buildTask({
    title: 'Write docs',
    assignee: 'alice',
    status: 'done',
    priority: 'low',
  }),
]

describe('filterTasks', () => {
  it('returns all tasks with empty criteria', () => {
    expect(
      filterTasks(tasks, {
        searchQuery: '',
        filters: { statuses: [], priorities: [], assignees: [] },
      }),
    ).toHaveLength(3)
  })

  it('searches title case-insensitively', () => {
    const result = filterTasks(tasks, {
      searchQuery: 'LOGIN',
      filters: { statuses: [], priorities: [], assignees: [] },
    })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Fix login bug')
  })

  it('searches description and assignee', () => {
    expect(
      filterTasks(tasks, {
        searchQuery: 'mockups',
        filters: { statuses: [], priorities: [], assignees: [] },
      }),
    ).toHaveLength(1)

    expect(
      filterTasks(tasks, {
        searchQuery: 'bob',
        filters: { statuses: [], priorities: [], assignees: [] },
      }),
    ).toHaveLength(1)
  })

  it('filters by status', () => {
    const result = filterTasks(tasks, {
      searchQuery: '',
      filters: { statuses: ['done'], priorities: [], assignees: [] },
    })
    expect(result).toHaveLength(1)
    expect(result[0].status).toBe('done')
  })

  it('filters by priority', () => {
    const result = filterTasks(tasks, {
      searchQuery: '',
      filters: { statuses: [], priorities: ['high'], assignees: [] },
    })
    expect(result).toHaveLength(1)
    expect(result[0].priority).toBe('high')
  })

  it('filters by assignee', () => {
    const result = filterTasks(tasks, {
      searchQuery: '',
      filters: { statuses: [], priorities: [], assignees: ['alice'] },
    })
    expect(result).toHaveLength(2)
  })

  it('combines search and filters', () => {
    const result = filterTasks(tasks, {
      searchQuery: 'alice',
      filters: { statuses: ['todo'], priorities: [], assignees: [] },
    })
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Fix login bug')
  })
})

describe('getUniqueAssignees', () => {
  it('returns sorted unique assignees', () => {
    expect(getUniqueAssignees(tasks)).toEqual(['alice', 'bob'])
  })
})

describe('hasActiveFilters', () => {
  it('detects active search or filters', () => {
    expect(
      hasActiveFilters({
        searchQuery: '',
        filters: { statuses: [], priorities: [], assignees: [] },
      }),
    ).toBe(false)
    expect(
      hasActiveFilters({
        searchQuery: 'test',
        filters: { statuses: [], priorities: [], assignees: [] },
      }),
    ).toBe(true)
    expect(
      hasActiveFilters({
        searchQuery: '',
        filters: { statuses: ['todo'], priorities: [], assignees: [] },
      }),
    ).toBe(true)
  })
})
