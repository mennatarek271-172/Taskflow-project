import { z } from 'zod'

export const moodTypeSchema = z.enum(['energetic', 'focused', 'calm', 'stressed', 'tired'])

export const moodEntrySchema = z.object({
  mood: moodTypeSchema,
  date: z.string(),
  timestamp: z.string(),
})

export type MoodType = z.infer<typeof moodTypeSchema>
export type MoodEntry = z.infer<typeof moodEntrySchema>
