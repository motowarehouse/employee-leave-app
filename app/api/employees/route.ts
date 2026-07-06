import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DEFAULT_ANNUAL_ENTITLEMENT } from '@/lib/constants'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const employees = await prisma.employee.findMany({
    orderBy: { name: 'asc' },
    include: { leaveEntries: true },
  })
  return NextResponse.json(employees)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, role, startDate, annualEntitlement } = body

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const employee = await prisma.employee.create({
    data: {
      name: name.trim(),
      role: role?.trim() || null,
      startDate: startDate ? new Date(startDate) : null,
      annualEntitlement: annualEntitlement ? Number(annualEntitlement) : DEFAULT_ANNUAL_ENTITLEMENT,
    },
  })

  return NextResponse.json(employee, { status: 201 })
}
