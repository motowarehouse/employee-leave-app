import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { summarizeLeave } from '@/lib/leave'
import EmployeeTable, { EmployeeRow } from '@/components/employees/EmployeeTable'

export const dynamic = 'force-dynamic'

export default async function EmployeesPage() {
  const employees = (await prisma.employee.findMany({
    where: { active: true },
    include: { leaveEntries: true },
    orderBy: { name: 'asc' },
  })) as Array<{
    id: string
    name: string
    role: string | null
    annualEntitlement: number
    leaveEntries: Array<{ type: 'ANNUAL' | 'SICK'; startDate: Date; workingDays: number }>
  }>

  const year = new Date().getFullYear()

  const rows: EmployeeRow[] = employees.map(emp => {
    const balance = summarizeLeave(emp.leaveEntries, emp.annualEntitlement, year)
    return {
      id: emp.id,
      name: emp.name,
      role: emp.role,
      entitlement: balance.entitlement,
      used: balance.annualUsed,
      remaining: balance.annualRemaining,
      sickUsed: balance.sickUsed,
    }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001A21' }}>Employees</h1>
          <p style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>Leave balances for {year}</p>
        </div>
        <Link href="/employees/new" className="btn-primary" style={{ textDecoration: 'none' }}>
          <PlusCircle size={14} strokeWidth={2} />
          Add Employee
        </Link>
      </div>

      <EmployeeTable rows={rows} />
    </div>
  )
}
