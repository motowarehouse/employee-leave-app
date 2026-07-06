import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { summarizeLeave } from '@/lib/leave'
import { formatDate } from '@/lib/utils'
import AddLeaveForm from '@/components/employees/AddLeaveForm'
import LeaveHistoryTable from '@/components/employees/LeaveHistoryTable'

export const dynamic = 'force-dynamic'

function BalanceCard({ label, value, accent }: { label: string; value: number | string; accent: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, padding: '16px 18px', flex: 1 }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999999', marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 700, color: accent }}>{value}</p>
    </div>
  )
}

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const employee = (await prisma.employee.findUnique({
    where: { id: params.id },
    include: { leaveEntries: { orderBy: { startDate: 'desc' } } },
  })) as {
    id: string
    name: string
    role: string | null
    startDate: Date | null
    annualEntitlement: number
    leaveEntries: Array<{
      id: string
      type: 'ANNUAL' | 'SICK'
      startDate: Date
      endDate: Date
      workingDays: number
      note: string | null
    }>
  } | null

  if (!employee) notFound()

  const year = new Date().getFullYear()
  const balance = summarizeLeave(employee.leaveEntries, employee.annualEntitlement, year)

  const remainingColor = balance.annualRemaining <= 3 ? '#DE1D1C' : balance.annualRemaining <= 7 ? '#FA8D14' : '#27AD5F'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <Link href="/employees" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#777777', textDecoration: 'none', marginBottom: 10 }}>
          <ArrowLeft size={13} strokeWidth={2} />
          Back to Employees
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001A21' }}>{employee.name}</h1>
            <p style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>
              {employee.role || 'No role set'}
              {employee.startDate ? ` · Started ${formatDate(employee.startDate)}` : ''}
            </p>
          </div>
          <AddLeaveForm employeeId={employee.id} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        <BalanceCard label={`${year} Entitlement`} value={balance.entitlement} accent="#001A21" />
        <BalanceCard label="Annual Used" value={balance.annualUsed} accent="#009BB4" />
        <BalanceCard label="Annual Remaining" value={balance.annualRemaining} accent={remainingColor} />
        <BalanceCard label="Sick Days Taken" value={balance.sickUsed} accent="#FA8D14" />
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#001A21', marginBottom: 10 }}>Leave History</p>
        <LeaveHistoryTable
          entries={employee.leaveEntries.map(e => ({
            id: e.id,
            type: e.type,
            startDate: e.startDate,
            endDate: e.endDate,
            workingDays: e.workingDays,
            note: e.note,
          }))}
        />
      </div>
    </div>
  )
}
