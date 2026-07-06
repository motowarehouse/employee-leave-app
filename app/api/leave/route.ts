import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { countWorkingDays, getHolidayKeySet } from '@/lib/leave'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { employeeId, type, startDate, endDate, note } = body

  if (!employeeId || !type || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (type !== 'ANNUAL' && type !== 'SICK') {
    return NextResponse.json({ error: 'Invalid leave type' }, { status: 400 })
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  if (end < start) {
    return NextResponse.json({ error: 'End date must be on or after start date' }, { status: 400 })
  }

  const holidayKeys = await getHolidayKeySet()
  const workingDays = countWorkingDays(start, end, holidayKeys)

  const entry = await prisma.leaveEntry.create({
    data: {
      employeeId,
      type,
      startDate: start,
      endDate: end,
      workingDays,
      note: note?.trim() || null,
    },
  })

  return NextResponse.json(entry, { status: 201 })
}
