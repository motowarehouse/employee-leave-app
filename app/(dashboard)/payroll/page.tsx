import { prisma } from '@/lib/prisma'
import PayrollTable, { PayrollRow } from '@/components/payroll/PayrollTable'

export const dynamic = 'force-dynamic'

export default async function PayrollPage() {
  const employees = (await prisma.employee.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })) as Array<{
    id: string
    name: string
    bank: string | null
    grossSalary: number | null
    netSalary: number | null
    cashAmount: number | null
    iban: string | null
    accountNumber: string | null
  }>

  const rows: PayrollRow[] = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    bank: emp.bank,
    grossSalary: emp.grossSalary,
    netSalary: emp.netSalary,
    cashAmount: emp.cashAmount,
    iban: emp.iban,
    accountNumber: emp.accountNumber,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001A21' }}>Payroll</h1>
        <p style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>
          Bank and salary details per employee. Agreement is auto-calculated as Net Salary + Cash. Click the pencil icon to edit a row.
        </p>
      </div>

      <PayrollTable rows={rows} />
    </div>
  )
}
