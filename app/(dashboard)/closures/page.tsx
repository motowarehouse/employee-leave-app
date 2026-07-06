import { prisma } from '@/lib/prisma'
import ClosureForm from '@/components/closures/ClosureForm'
import ClosureList from '@/components/closures/ClosureList'

export const dynamic = 'force-dynamic'

export default async function ClosuresPage() {
  const [closures, employeeCount] = (await Promise.all([
    prisma.closure.findMany({
      orderBy: { startDate: 'desc' },
      include: { entries: true },
    }),
    prisma.employee.count({ where: { active: true } }),
  ])) as [
    Array<{
      id: string
      name: string
      startDate: Date
      endDate: Date
      entries: Array<{ workingDays: number }>
    }>,
    number
  ]

  const rows = closures.map(c => ({
    id: c.id,
    name: c.name,
    startDate: c.startDate,
    endDate: c.endDate,
    workingDays: c.entries[0]?.workingDays ?? 0,
    employeeCount: c.entries.length,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001A21' }}>Shop Closures</h1>
          <p style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>
            Log a date range once and it's applied as annual leave for the whole team — e.g. the August break or Christmas.
          </p>
        </div>
        <ClosureForm employeeCount={employeeCount} />
      </div>

      <ClosureList closures={rows} />
    </div>
  )
}
