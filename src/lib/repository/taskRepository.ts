import { taskSchema, type Task } from '@/features/tasks/schemas/taskSchema'
import { BaseRepository } from './baseRepository'

const STORAGE_KEY = 'taskflow-tasks'

export class TaskRepository extends BaseRepository<Task> {
  load(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []

      const parsed: unknown = JSON.parse(raw)
      const result = taskSchema.array().safeParse(parsed)
      if (!result.success) return []

      this.setAll(result.data)
      return this.getAll()
    } catch {
      return []
    }
  }

  save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.getAll()))
  }

  createAndSave(item: Task): Task {
    const created = this.create(item)
    this.save()
    return created
  }

  updateAndSave(id: string, updates: Partial<Task>): Task | undefined {
    const updated = this.update(id, updates)
    if (updated) this.save()
    return updated
  }

  deleteAndSave(id: string): boolean {
    const deleted = this.delete(id)
    if (deleted) this.save()
    return deleted
  }

  replaceAllAndSave(items: Task[]): void {
    this.setAll(items)
    this.save()
  }
}

export const taskRepository = new TaskRepository()
