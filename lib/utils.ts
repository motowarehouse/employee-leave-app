import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a date for display, e.g. 06/07/2026 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  return format(new Date(date), 'dd/MM/yyyy')
}

/** Format a date range compactly, e.g. "6 – 10 Jul 2026" or "28 Dec 2026 – 3 Jan 2027" */
export function formatDateRange(start: Date | string, end: Date | string): string {
  const s = new Date(start)
  const e = new Date(end)
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()
  const sameYear = s.getFullYear() === e.getFullYear()

  if (s.getTime() === e.getTime()) return format(s, 'd MMM yyyy')
  if (sameMonth) return `${format(s, 'd')} – ${format(e, 'd MMM yyyy')}`
  if (sameYear) return `${format(s, 'd MMM')} – ${format(e, 'd MMM yyyy')}`
  return `${format(s, 'd MMM yyyy')} – ${format(e, 'd MMM yyyy')}`
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
