import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/shared/components/Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('TaskFlow ErrorBoundary:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center"
          data-testid="error-boundary"
          role="alert"
        >
          <span className="mb-4 text-5xl">⚠️</span>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Something went wrong</h2>
          <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <Button className="mt-6" onClick={this.handleReset}>
            Reload app
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
