import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-primary)]">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full rounded-[var(--radius-md)] border bg-[var(--bg-primary)] px-3 text-sm',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'border-[var(--border-default)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20',
            error &&
              'border-[var(--color-danger-500)] focus:border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)]/20',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />
        {error ? (
          <p
            id={`${inputId}-error`}
            className="text-xs text-[var(--color-danger-500)]"
            role="alert"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--text-muted)]">
            {hint}
          </p>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
