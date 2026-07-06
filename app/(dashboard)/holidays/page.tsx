import { prisma } from '@/lib/prisma'
import HolidayManager from '@/components/holidays/HolidayManager'

export const dynamic = 'force-dynamic'

export default async function HolidaysPage() {
  const holidays = (await prisma.publicHoliday.findMany({ orderBy: { date: 'asc' } })) as Array<{ id: string; date: Date; name: string }>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001A21' }}>Public Holidays</h1>
        <p style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>
          Cyprus public holidays are excluded automatically from working-day calculations. Add next year's dates here when they're announced.
        </p>
      </div>
      <HolidayManager holidays={holidays.map(h => ({ id: h.id, date: h.date, name: h.name }))} />
    </div>
  )
}
