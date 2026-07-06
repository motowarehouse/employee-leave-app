import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { countWorkingDays, getHolidayKeySet } from '@/lib/leave'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const closures = await prisma.closure.findMany({
    orderBy: { startDate: 'desc' },
    include: { entries: { include: { employee: true } } },
  })
  return NextResponse.json(closures)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, startDate, endDate } = body

  if (!name || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  if (end < start) {
    return NextResponse.json({ error: 'End date must be on or after start date' }, { status: 400 })
  }

  const holidayKeys = await getHolidayKeySet()
  const workingDays = countWorkingDays(start, end, holidayKeys)

  const employees = (await prisma.employee.findMany({ where: { active: true } })) as Array<{ id: string }>

  const closure = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const created = await tx.closure.create({
      data: { name: name.trim(), startDate: start, endDate: end },
    })

    if (employees.length > 0) {
      await tx.leaveEntry.createMany({
        data: employees.map(emp => ({
          employeeId: emp.id,
          type: 'ANNUAL' as const,
          startDate: start,
          endDate: end,
          workingDays,
          note: `Shop closure: ${name.trim()}`,
          closureId: created.id,
        })),
      })
    }

    return tx.closure.findUnique({
      where: { id: created.id },
      include: { entries: { include: { employee: true } } },
    })
  })

  return NextResponse.json(closure, { status: 201 })
}
