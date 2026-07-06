import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const holidays = await prisma.publicHoliday.findMany({ orderBy: { date: 'asc' } })
  return NextResponse.json(holidays)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { date, name } = body
  if (!date || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const holiday = await prisma.publicHoliday.upsert({
    where: { date: new Date(date) },
    update: { name: name.trim() },
    create: { date: new Date(date), name: name.trim() },
  })

  return NextResponse.json(holiday, { status: 201 })
}
