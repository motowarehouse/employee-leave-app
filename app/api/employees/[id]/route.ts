import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { leaveEntries: { orderBy: { startDate: 'desc' } } },
  })
  if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(employee)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    name, role, startDate, annualEntitlement, active,
    bank, grossSalary, netSalary, cashAmount, iban, accountNumber,
  } = body

  const employee = await prisma.employee.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(role !== undefined && { role: role?.trim() || null }),
      ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
      ...(annualEntitlement !== undefined && { annualEntitlement: Number(annualEntitlement) }),
      ...(active !== undefined && { active: Boolean(active) }),
      ...(bank !== undefined && { bank: bank?.trim() || null }),
      ...(grossSalary !== undefined && { grossSalary: grossSalary === '' || grossSalary === null ? null : Number(grossSalary) }),
      ...(netSalary !== undefined && { netSalary: netSalary === '' || netSalary === null ? null : Number(netSalary) }),
      ...(cashAmount !== undefined && { cashAmount: cashAmount === '' || cashAmount === null ? null : Number(cashAmount) }),
      ...(iban !== undefined && { iban: iban?.trim() || null }),
      ...(accountNumber !== undefined && { accountNumber: accountNumber?.trim() || null }),
    },
  })

  return NextResponse.json(employee)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.employee.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
