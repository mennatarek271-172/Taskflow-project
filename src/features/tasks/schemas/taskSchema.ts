import { z } from 'zod'

export const taskStatusSchema = z.enum(['todo', 'in_progress', 'done'])
export const taskPrioritySchema = z.enum(['low', 'medium', 'high'])

export const activityLogEntrySchema = z.object({
  id: z.string(),
  action: z.string(),
  timestamp: z.string(),
  details: z.string().optional(),
})

export const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  completed: z.boolean(),
})

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()),
  subtasks: z.array(subtaskSchema),
  activityLog: z.array(activityLogEntrySchema),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createTaskInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
  subtasks: z.array(subtaskSchema).optional(),
})

export const updateTaskInputSchema = createTaskInputSchema.partial().extend({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
})

export type TaskStatus = z.infer<typeof taskStatusSchema>
export type TaskPriority = z.infer<typeof taskPrioritySchema>
export type ActivityLogEntry = z.infer<typeof activityLogEntrySchema>
export type Subtask = z.infer<typeof subtaskSchema>
export type Task = z.infer<typeof taskSchema>
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>
