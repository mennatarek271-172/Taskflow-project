export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function calculateDailyStreak(
  completionDates: string[],
  referenceDate: Date = new Date(),
): number {
  if (completionDates.length === 0) return 0

  const uniqueDays = [...new Set(completionDates)].sort()
  const ref = toDateKey(referenceDate)

  if (!uniqueDays.includes(ref)) {
    const yesterday = new Date(referenceDate)
    yesterday.setDate(yesterday.getDate() - 1)
    if (!uniqueDays.includes(toDateKey(yesterday))) return 0
  }

  let streak = 0
  const check = new Date(referenceDate)
  check.setHours(0, 0, 0, 0)

  while (uniqueDays.includes(toDateKey(check))) {
    streak += 1
    check.setDate(check.getDate() - 1)
  }

  return streak
}

export function getWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return toDateKey(d)
}

export function calculateWeeklyStreak(
  completionDates: string[],
  referenceDate: Date = new Date(),
): number {
  if (completionDates.length === 0) return 0

  const weeks = new Set(completionDates.map((d) => getWeekKey(new Date(d))))
  let streak = 0
  const check = new Date(referenceDate)
  check.setHours(0, 0, 0, 0)
  check.setDate(check.getDate() - check.getDay())

  while (weeks.has(getWeekKey(check))) {
    streak += 1
    check.setDate(check.getDate() - 7)
  }

  return streak
}

export interface HeatmapCell {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export function buildStreakHeatmap(
  completionDates: string[],
  weeks = 12,
  referenceDate: Date = new Date(),
): HeatmapCell[] {
  const counts = new Map<string, number>()
  for (const d of completionDates) {
    counts.set(d, (counts.get(d) ?? 0) + 1)
  }

  const cells: HeatmapCell[] = []
  const end = new Date(referenceDate)
  end.setHours(0, 0, 0, 0)
  const start = new Date(end)
  start.setDate(start.getDate() - weeks * 7 + 1)

  const current = new Date(start)
  while (current <= end) {
    const key = toDateKey(current)
    const count = counts.get(key) ?? 0
    let level: HeatmapCell['level'] = 0
    if (count >= 4) level = 4
    else if (count === 3) level = 3
    else if (count === 2) level = 2
    else if (count === 1) level = 1

    cells.push({ date: key, count, level })
    current.setDate(current.getDate() + 1)
  }

  return cells
}
