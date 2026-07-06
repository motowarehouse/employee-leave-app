import { LEAVE_TYPE_CONFIG } from '@/lib/constants'

export interface DayCell {
  day: number
  weekend: boolean
  holidayName: string | null
}

export interface EmployeeCalendarRow {
  id: string
  name: string
  // keyed by day number (1-31) -> leave type, only present if on leave that day
  leaveByDay: Record<number, 'ANNUAL' | 'SICK'>
}

export default function TeamCalendar({ days, rows }: { days: DayCell[]; rows: EmployeeCalendarRow[] }) {
  const cellWidth = 30

  return (
    <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
        <thead>
          <tr>
            <th style={{
              position: 'sticky', left: 0, background: '#FAFAFA', zIndex: 1,
              padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999999',
              borderBottom: '1px solid #E6E6E6', borderRight: '1px solid #E6E6E6',
              minWidth: 140,
            }}>
              Employee
            </th>
            {days.map(d => (
              <th
                key={d.day}
                title={d.holidayName ?? undefined}
                style={{
                  width: cellWidth, minWidth: cellWidth,
                  padding: '9px 2px', textAlign: 'center', fontSize: 10, fontWeight: 600,
                  color: d.holidayName ? '#DE1D1C' : d.weekend ? '#C7C7C7' : '#999999',
                  background: d.weekend ? '#F5F5F5' : '#FAFAFA',
                  borderBottom: '1px solid #E6E6E6',
                }}
              >
                {d.day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
              <td style={{
                position: 'sticky', left: 0, background: 'white', zIndex: 1,
                padding: '8px 14px', fontSize: 13, fontWeight: 600, color: '#001A21',
                borderRight: '1px solid #E6E6E6', whiteSpace: 'nowrap',
              }}>
                {row.name}
              </td>
              {days.map(d => {
                const type = row.leaveByDay[d.day]
                const cfg = type ? LEAVE_TYPE_CONFIG[type] : null
                return (
                  <td
                    key={d.day}
                    style={{
                      width: cellWidth, minWidth: cellWidth, height: 30,
                      background: cfg ? cfg.color : d.weekend ? '#FAFAFA' : 'transparent',
                      opacity: cfg ? 0.85 : 1,
                    }}
                  />
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
