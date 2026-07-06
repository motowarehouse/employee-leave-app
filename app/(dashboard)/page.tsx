import Link from 'next/link'
import { PlusCircle, Building2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import StatsCards from '@/components/dashboard/StatsCards'
import WhosOff, { OffEntry } from '@/components/dashboard/WhosOff'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [employees, entries] = (await Promise.all([
    prisma.employee.findMany({ where: { active: true } }),
    prisma.leaveEntry.findMany({
      include: { employee: true },
      orderBy: { startDate: 'asc' },
    }),
  ])) as [
    Array<{ id: string; name: string }>,
    Array<{
      id: string
      employeeId: string
      type: 'ANNUAL' | 'SICK'
      startDate: Date
      endDate: Date
      note: string | null
      employee: { name: string }
    }>
  ]

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const in14Days = new Date(today)
  in14Days.setDate(in14Days.getDate() + 14)

  const isOn = (e: (typeof entries)[number], d: Date) => {
    const s = new Date(e.startDate); s.setHours(0, 0, 0, 0)
    const en = new Date(e.endDate); en.setHours(0, 0, 0, 0)
    return d >= s && d <= en
  }

  const toOffEntry = (e: (typeof entries)[number]): OffEntry => ({
    id: e.id,
    employeeId: e.employeeId,
    employeeName: e.employee.name,
    type: e.type,
    startDate: e.startDate,
    endDate: e.endDate,
    note: e.note,
  })

  const offToday = entries.filter(e => isOn(e, today))
  const sickToday = offToday.filter(e => e.type === 'SICK')

  // Rolling 7-day window starting today (simpler and unambiguous vs. calendar week)
  const weekEnd = new Date(today)
  weekEnd.setDate(weekEnd.getDate() + 6)
  const offThisWeekSet = new Set(
    entries.filter(e => {
      const s = new Date(e.startDate)
      const en = new Date(e.endDate)
      return en >= today && s <= weekEnd
    }).map(e => e.employeeId)
  )

  const upcoming = entries.filter(e => {
    const s = new Date(e.startDate); s.setHours(0, 0, 0, 0)
    return s > today && s <= in14Days
  }).slice(0, 8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001A21' }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>{formatDate(today)}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/closures" className="btn-secondary" style={{ textDecoration: 'none' }}>
            <Building2 size={14} strokeWidth={2} />
            Shop Closure
          </Link>
          <Link href="/employees/new" className="btn-primary" style={{ textDecoration: 'none' }}>
            <PlusCircle size={14} strokeWidth={2} />
            Add Employee
          </Link>
        </div>
      </div>

      <StatsCards
        stats={{
          totalEmployees: employees.length,
          offToday: offToday.length,
          sickToday: sickToday.length,
          offThisWeek: offThisWeekSet.size,
        }}
      />

      <WhosOff today={offToday.map(toOffEntry)} upcoming={upcoming.map(toOffEntry)} />
    </div>
  )
}
