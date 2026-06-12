import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { cn } from '@/shared/utils/cn'
import {
  createTaskInputSchema,
  type CreateTaskInput,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '../../schemas/taskSchema'
import { DatePicker } from '../DatePicker'
import { isOverdue } from '../../utils/dateUtils'

export interface TaskFormProps {
  task?: Task
  onSubmit: (data: CreateTaskInput) => void
  onCancel?: () => void
  className?: string
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export function TaskForm({ task, onSubmit, onCancel, className }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskInputSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? 'todo',
      priority: task?.priority ?? 'medium',
      assignee: task?.assignee ?? '',
      dueDate: task?.dueDate,
      tags: task?.tags ?? [],
    },
  })

  const status = watch('status')

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        assignee: task.assignee ?? '',
        dueDate: task.dueDate,
        tags: task.tags,
      })
    }
  }, [task, reset])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn('flex w-full flex-col gap-4', className)}
      data-testid="task-form"
    >
      <Input
        label="Title"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-[var(--text-primary)]">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Add details..."
          className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          {...register('description')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-[var(--text-primary)]">
            Status
          </label>
          <select
            id="status"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 text-sm text-[var(--text-primary)]"
            {...register('status')}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="priority" className="text-sm font-medium text-[var(--text-primary)]">
            Priority
          </label>
          <select
            id="priority"
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-primary)] px-3 text-sm text-[var(--text-primary)]"
            {...register('priority')}
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input label="Assignee" placeholder="username" {...register('assignee')} />

      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Due date"
            value={field.value}
            onChange={field.onChange}
            isOverdue={isOverdue(field.value, status ?? 'todo')}
          />
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <Input
            label="Tags"
            placeholder="design, urgent (comma separated)"
            value={field.value?.join(', ') ?? ''}
            onChange={(e) =>
              field.onChange(
                e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean),
              )
            }
            hint="Separate tags with commas"
          />
        )}
      />

      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" isLoading={isSubmitting}>
          {task ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}
