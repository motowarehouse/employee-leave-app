import { eachDayOfInterval, isSunday, format, getYear } from 'date-fns'
import { prisma } from './prisma'

export type LeaveTypeValue = 'ANNUAL' | 'SICK'

/** yyyy-MM-dd key used for holiday-set lookups, timezone-safe (local date parts only). */
export function dateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Count working days (Mon–Sat, excluding Sundays and the given public
 * holidays) in an inclusive date range. Saturdays count as working days.
 */
export function countWorkingDays(start: Date, end: Date, holidayKeys: Set<string>): number {
  if (end < start) return 0
  const days = eachDayOfInterval({ start, end })
  let count = 0
  for (const day of days) {
    if (isSunday(day)) continue
    if (holidayKeys.has(dateKey(day))) continue
    count++
  }
  return count
}

/** Fetch all public holiday dates as a Set of yyyy-MM-dd keys. */
export async function getHolidayKeySet(): Promise<Set<string>> {
  const holidays = (await prisma.publicHoliday.findMany()) as Array<{ date: Date }>
  return new Set(holidays.map(h => dateKey(new Date(h.date))))
}

export interface LeaveEntrySummary {
  type: LeaveTypeValue
  startDate: Date
  workingDays: number
}

export interface LeaveBalance {
  year: number
  entitlement: number
  annualUsed: number
  annualRemaining: number
  sickUsed: number
}

/**
 * Summarize an employee's leave for a given calendar year. Entries are
 * attributed to the year of their start date.
 */
export function summarizeLeave(
  entries: LeaveEntrySummary[],
  entitlement: number,
  year: number
): LeaveBalance {
  let annualUsed = 0
  let sickUsed = 0

  for (const entry of entries) {
    if (getYear(new Date(entry.startDate)) !== year) continue
    if (entry.type === 'ANNUAL') annualUsed += entry.workingDays
    else if (entry.type === 'SICK') sickUsed += entry.workingDays
  }

  return {
    year,
    entitlement,
    annualUsed,
    annualRemaining: entitlement - annualUsed, // can go negative if over-booked; surfaced as-is
    sickUsed,
  }
}
