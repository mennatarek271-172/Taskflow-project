import type { MoodType } from '../schemas/moodSchema'

export interface MoodConfig {
  label: string
  emoji: string
  description: string
  themeClass: string
  accent: string
}

export const MOOD_CONFIG: Record<MoodType, MoodConfig> = {
  energetic: {
    label: 'Energetic',
    emoji: '⚡',
    description: 'Ready to tackle big challenges',
    themeClass: 'mood-energetic',
    accent: '#f59e0b',
  },
  focused: {
    label: 'Focused',
    emoji: '🎯',
    description: 'Deep work mode — one thing at a time',
    themeClass: 'mood-focused',
    accent: '#3b82f6',
  },
  calm: {
    label: 'Calm',
    emoji: '🌿',
    description: 'Steady pace, no rush',
    themeClass: 'mood-calm',
    accent: '#22c55e',
  },
  stressed: {
    label: 'Stressed',
    emoji: '😰',
    description: "Let's clear the urgent stuff first",
    themeClass: 'mood-stressed',
    accent: '#ef4444',
  },
  tired: {
    label: 'Tired',
    emoji: '😴',
    description: 'Quick wins and easy tasks today',
    themeClass: 'mood-tired',
    accent: '#8b5cf6',
  },
}

export const MOOD_TYPES: MoodType[] = ['energetic', 'focused', 'calm', 'stressed', 'tired']

export function getTodayDateKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
