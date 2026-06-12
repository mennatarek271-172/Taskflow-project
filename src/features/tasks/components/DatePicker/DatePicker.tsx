import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeVariants, scaleVariants } from '@/shared/motion/variants'
import { cn } from '@/shared/utils/cn'
import { getCalendarDays, toDateInputValue } from '../../utils/dateUtils'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export interface DatePickerProps {
  value?: string
  onChange: (value: string | undefined) => void
  label?: string
  error?: string
  isOverdue?: boolean
}

export function DatePicker({ value, onChange, label, error, isOverdue }: DatePickerProps) {
  const initial = value ? new Date(value) : new Date()
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const days = getCalendarDays(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const selectDate = (date: Date) => {
    onChange(toDateInputValue(date))
    setOpen(false)
  }

  const displayValue = value
    ? new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Select date'

  return (
    <div className="relative flex flex-col gap-1.5">
      {label ? (
        <label className="text-sm font-medium text-[var(--text-primary)]">{label}</label>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-[var(--radius-md)] border px-3 text-sm',
          'bg-[var(--bg-primary)] text-left text-[var(--text-primary)]',
          'border-[var(--border-default)] hover:border-[var(--accent)]',
          isOverdue && 'border-[var(--color-danger-500)] text-[var(--color-danger-500)]',
          error && 'border-[var(--color-danger-500)]',
        )}
      >
        <span>{displayValue}</span>
        <span className="text-[var(--text-muted)]">📅</span>
      </button>
      {isOverdue ? <p className="text-xs text-[var(--color-danger-500)]">Overdue</p> : null}
      {error ? <p className="text-xs text-[var(--color-danger-500)]">{error}</p> : null}

      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute top-full z-20 mt-1 w-full min-w-[280px] rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3 shadow-[var(--shadow-lg)]"
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded p-1 hover:bg-[var(--bg-tertiary)]"
                aria-label="Previous month"
              >
                ‹
              </button>
              <span className="text-sm font-medium">
                {new Date(viewYear, viewMonth).toLocaleDateString(undefined, {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded p-1 hover:bg-[var(--bg-tertiary)]"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
            <div className="mb-1 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-center text-xs text-[var(--text-muted)]">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, i) =>
                date ? (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectDate(date)}
                    className={cn(
                      'h-8 rounded text-sm hover:bg-[var(--bg-tertiary)]',
                      value === toDateInputValue(date) &&
                        'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]',
                      date < new Date(new Date().setHours(0, 0, 0, 0)) &&
                        !value?.startsWith(toDateInputValue(date)) &&
                        'text-[var(--color-danger-500)]',
                    )}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div key={i} />
                ),
              )}
            </div>
            {value ? (
              <motion.button
                type="button"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                onClick={() => {
                  onChange(undefined)
                  setOpen(false)
                }}
                className="mt-2 w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Clear date
              </motion.button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
