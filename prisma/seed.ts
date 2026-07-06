import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Cyprus public holidays — 2026. Add more years from the Holidays page in the app,
// or edit this list before re-seeding.
const HOLIDAYS_2026 = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-01-06', name: 'Epiphany' },
  { date: '2026-02-23', name: 'Green Monday' },
  { date: '2026-03-25', name: 'Greek Independence Day' },
  { date: '2026-04-01', name: 'Cyprus National Day' },
  { date: '2026-04-10', name: 'Good Friday' },
  { date: '2026-04-13', name: 'Easter Monday' },
  { date: '2026-05-01', name: 'Labour Day' },
  { date: '2026-06-01', name: 'Pentecost Monday (Kataklysmos)' },
  { date: '2026-08-15', name: 'Assumption Day' },
  { date: '2026-10-01', name: 'Cyprus Independence Day' },
  { date: '2026-10-28', name: 'Ochi Day' },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-26', name: 'Boxing Day' },
]

async function main() {
  // ── Admin users ──────────────────────────────────────────────
  const admins = [
    {
      username: process.env.ADMIN1_USERNAME || 'nikolas',
      password: process.env.ADMIN1_PASSWORD || 'change-me-1',
      name: process.env.ADMIN1_NAME || 'Nikolas',
    },
    {
      username: process.env.ADMIN2_USERNAME || 'owner',
      password: process.env.ADMIN2_PASSWORD || 'change-me-2',
      name: process.env.ADMIN2_NAME || 'Owner',
    },
  ]

  for (const admin of admins) {
    const hashed = await bcrypt.hash(admin.password, 10)
    await prisma.user.upsert({
      where: { username: admin.username },
      update: {},
      create: { username: admin.username, password: hashed, name: admin.name },
    })
    console.log(`User ready: ${admin.username}`)
  }

  // ── Public holidays ──────────────────────────────────────────
  for (const h of HOLIDAYS_2026) {
    await prisma.publicHoliday.upsert({
      where: { date: new Date(h.date) },
      update: { name: h.name },
      create: { date: new Date(h.date), name: h.name },
    })
  }
  console.log(`Seeded ${HOLIDAYS_2026.length} public holidays for 2026`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
