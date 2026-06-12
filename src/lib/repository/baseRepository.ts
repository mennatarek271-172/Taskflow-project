export interface Repository<T> {
  getAll(): T[]
  getById(id: string): T | undefined
  create(item: T): T
  update(id: string, updates: Partial<T>): T | undefined
  delete(id: string): boolean
}

export abstract class BaseRepository<T extends { id: string }> implements Repository<T> {
  protected items: T[] = []

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems]
  }

  getAll(): T[] {
    return [...this.items]
  }

  getById(id: string): T | undefined {
    return this.items.find((item) => item.id === id)
  }

  create(item: T): T {
    this.items.push(item)
    return item
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) return undefined
    this.items[index] = { ...this.items[index], ...updates }
    return this.items[index]
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) return false
    this.items.splice(index, 1)
    return true
  }

  setAll(items: T[]): void {
    this.items = [...items]
  }
}
