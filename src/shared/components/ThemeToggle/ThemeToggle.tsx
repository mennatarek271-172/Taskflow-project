import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/shared/components/Button'
import { Tooltip } from '@/shared/components/Tooltip'

export function ThemeToggle() {
  const theme = useAppStore((s) => s.theme)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme

  return (
    <Tooltip content={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        data-testid="theme-toggle"
      >
        {resolvedTheme === 'dark' ? '☀️' : '🌙'}
      </Button>
    </Tooltip>
  )
}
