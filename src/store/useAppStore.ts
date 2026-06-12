import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme } from '@/shared/types'

interface AppState {
  theme: Theme
  sidebarOpen: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme)
  document.documentElement.setAttribute('data-theme', resolved)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      sidebarOpen: true,

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },

      toggleTheme: () => {
        const current = resolveTheme(get().theme)
        const next: Theme = current === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)

export function initTheme() {
  const stored = localStorage.getItem('app-store')
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as { state?: { theme?: Theme } }
      const theme = parsed.state?.theme ?? 'system'
      applyTheme(theme)
      return
    } catch {
      /* fall through */
    }
  }
  applyTheme('system')
}
