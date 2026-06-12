import { beforeEach, describe, expect, it } from 'vitest'
import { useFilterStore } from './useFilterStore'

describe('useFilterStore', () => {
  beforeEach(() => {
    useFilterStore.getState().clearFilters()
  })

  it('toggles status filters', () => {
    useFilterStore.getState().toggleStatus('todo')
    expect(useFilterStore.getState().filters.statuses).toEqual(['todo'])
    useFilterStore.getState().toggleStatus('todo')
    expect(useFilterStore.getState().filters.statuses).toEqual([])
  })

  it('clears all filters and search', () => {
    useFilterStore.getState().setSearchInput('test')
    useFilterStore.getState().togglePriority('high')
    useFilterStore.getState().clearFilters()
    expect(useFilterStore.getState().searchInput).toBe('')
    expect(useFilterStore.getState().filters.priorities).toEqual([])
  })
})
