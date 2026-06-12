import type { Task } from '@/features/tasks/schemas/taskSchema'

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function tasksToCsv(tasks: Task[]): string {
  const headers = [
    'id',
    'title',
    'description',
    'status',
    'priority',
    'assignee',
    'dueDate',
    'tags',
    'createdAt',
    'updatedAt',
  ]

  const rows = tasks.map((task) =>
    [
      task.id,
      task.title,
      task.description ?? '',
      task.status,
      task.priority,
      task.assignee ?? '',
      task.dueDate ?? '',
      task.tags.join(';'),
      task.createdAt,
      task.updatedAt,
    ]
      .map((v) => escapeCsv(String(v)))
      .join(','),
  )

  return [headers.join(','), ...rows].join('\n')
}

export function downloadCsv(tasks: Task[], filename = 'taskflow-export.csv'): void {
  const csv = tasksToCsv(tasks)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
