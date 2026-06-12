import { describe, expect, it } from 'vitest'
import { BaseRepository } from './baseRepository'

interface TestItem {
  id: string
  name: string
}

class TestRepository extends BaseRepository<TestItem> {}

describe('BaseRepository', () => {
  it('performs CRUD operations', () => {
    const repo = new TestRepository()
    const item = { id: '1', name: 'Test' }

    repo.create(item)
    expect(repo.getAll()).toHaveLength(1)
    expect(repo.getById('1')).toEqual(item)

    repo.update('1', { name: 'Updated' })
    expect(repo.getById('1')?.name).toBe('Updated')

    expect(repo.delete('1')).toBe(true)
    expect(repo.getAll()).toHaveLength(0)
  })
})
