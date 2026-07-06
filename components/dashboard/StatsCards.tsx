'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, UserX, Stethoscope, CalendarClock } from 'lucide-react'

interface Stats {
  totalEmployees: number
  offToday: number
  sickToday: number
  offThisWeek: number
}

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * target))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}

interface CardProps {
  label: string
  value: number
  icon: React.ElementType
  accent: string
  gradient?: string
  delay?: string
}

function StatCard({ label, value, icon: Icon, accent, gradient, delay = '0s' }: CardProps) {
  const count = useCountUp(value)

  return (
    <div
      className="animate-fade-up"
      style={{
        background: 'white',
        border: '1px solid #E6E6E6',
        borderRadius: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        animationDelay: delay,
      }}
    >
      <div style={{ height: 2, background: gradient ?? accent }} />
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#999999', marginBottom: 6 }}>
            {label}
          </p>
          <p style={{ fontSize: 38, fontWeight: 600, color: '#222222', lineHeight: 1 }}>
            {count}
          </p>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 2, flexShrink: 0,
          background: `${accent}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} strokeWidth={1.5} color={accent} />
        </div>
      </div>
    </div>
  )
}

export default function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      <StatCard
        label="Total Employees"
        value={stats.totalEmployees}
        icon={Users}
        accent="#009BB4"
        gradient="linear-gradient(90deg, #001A21 0%, #009BB4 100%)"
        delay="0ms"
      />
      <StatCard
        label="Off Today"
        value={stats.offToday}
        icon={UserX}
        accent="#009BB4"
        delay="60ms"
      />
      <StatCard
        label="Sick Today"
        value={stats.sickToday}
        icon={Stethoscope}
        accent="#FA8D14"
        delay="120ms"
      />
      <StatCard
        label="Off This Week"
        value={stats.offThisWeek}
        icon={CalendarClock}
        accent="#27AD5F"
        delay="180ms"
      />
    </div>
  )
}
