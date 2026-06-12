import { create } from 'zustand'
import type { RiskSeverity } from '@/features/tasks/lib/riskDetection'

export type ToastVariant = 'risk' | 'gamification' | 'default'

export interface Toast {
  id: string
  message: string
  severity: RiskSeverity
  variant: ToastVariant
}

interface ToastState {
  toasts: Toast[]
  addToast: (message: string, severity?: RiskSeverity) => void
  addGamificationToast: (message: string) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

function pushToast(
  set: (fn: (state: ToastState) => Partial<ToastState>) => void,
  toast: Omit<Toast, 'id'>,
) {
  const id = crypto.randomUUID()
  set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
  setTimeout(() => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  }, 5000)
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (message, severity = 'medium') => {
    pushToast(set, { message, severity, variant: 'risk' })
  },

  addGamificationToast: (message) => {
    pushToast(set, { message, severity: 'low', variant: 'gamification' })
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  clearToasts: () => set({ toasts: [] }),
}))
