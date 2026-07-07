import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getDaysInMonth, isSunday, format } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { dateKey } from '@/lib/leave'
import TeamCalendar, { DayCell, EmployeeCalendarRow } from '@/components/calendar/TeamCalendar'

export const dynamic = 'force-dynamic'

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { month?: string; year?: string }
}) {
  const now = new Date()
  const year = searchParams.year ? parseInt(searchParams.year) : now.getFullYear()
  const month = searchParams.month ? parseInt(searchParams.month) : now.getMonth() + 1 // 1-12

  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = new Date(year, month, 0) // last day of month
  const daysInMonth = getDaysInMonth(monthStart)

  const [employees, entries, holidays] = (await Promise.all([
    prisma.employee.findMany({ where: { active: true }, orderBy: { name: 'asc' } }),
    prisma.leaveEntry.findMany({
      where: { startDate: { lte: monthEnd }, endDate: { gte: monthStart } },
    }),
    prisma.publicHoliday.findMany({
      where: { date: { gte: monthStart, lte: monthEnd } },
    }),
  ])) as [
    { id: string; name: string }[],
    { employeeId: string; type: 'ANNUAL' | 'SICK'; startDate: Date; endDate: Date }[],
    { date: Date; name: string }[]
  ]

  const holidayMap = new Map<string, string>(holidays.map((h: { date: Date; name: string }) => [dateKey(new Date(h.date)), h.name] as [string, string]))

  const days: DayCell[] = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month - 1, i + 1)
    return {
      day: i + 1,
      weekend: isSunday(d),
      holidayName: holidayMap.get(dateKey(d)) ?? null,
    }
  })

  const rows: EmployeeCalendarRow[] = employees.map((emp: { id: string; name: string }) => {
    const leaveByDay: Record<number, 'ANNUAL' | 'SICK'> = {}
    for (const entry of entries) {
      if (entry.employeeId !== emp.id) continue
      const s = new Date(entry.startDate)
      const e = new Date(entry.endDate)
      for (let d = 1; d <= daysInMonth; d++) {
        const day = new Date(year, month - 1, d)
        if (day >= s && day <= e) leaveByDay[d] = entry.type
      }
    }
    return { id: emp.id, name: emp.name, leaveByDay }
  })

  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear = month === 1 ? year - 1 : year
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001A21' }}>Team Calendar</h1>
          <p style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>Whole-team leave at a glance</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href={`/calendar?month=${prevMonth}&year=${prevYear}`} className="btn-secondary" style={{ textDecoration: 'none', padding: '0 10px' }}>
            <ChevronLeft size={15} strokeWidth={2} />
          </Link>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#001A21', minWidth: 130, textAlign: 'center' }}>
            {format(monthStart, 'MMMM yyyy')}
          </span>
          <Link href={`/calendar?month=${nextMonth}&year=${nextYear}`} className="btn-secondary" style={{ textDecoration: 'none', padding: '0 10px' }}>
            <ChevronRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#009BB4', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#666666' }}>Annual Leave</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#FA8D14', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#666666' }}>Sick Leave</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#F5F5F5', border: '1px solid #E6E6E6', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#666666' }}>Sunday</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: '#DE1D1C', fontWeight: 700 }}>12</span>
          <span style={{ fontSize: 12, color: '#666666' }}>Public Holiday (hover date for name)</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, padding: '40px 16px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#ABABAD' }}>Add employees to see them on the calendar.</p>
        </div>
      ) : (
        <TeamCalendar days={days} rows={rows} />
      )}
    </div>
  )
}
