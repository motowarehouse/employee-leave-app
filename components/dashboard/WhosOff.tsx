import Link from 'next/link'
import LeaveTypeBadge from '@/components/ui/LeaveTypeBadge'
import { formatDateRange } from '@/lib/utils'

export interface OffEntry {
  id: string
  employeeId: string
  employeeName: string
  type: 'ANNUAL' | 'SICK'
  startDate: Date | string
  endDate: Date | string
  note: string | null
}

function Panel({ title, entries, emptyText }: { title: string; entries: OffEntry[]; emptyText: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #F0F0F0' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#001A21', letterSpacing: '0.02em' }}>{title}</p>
      </div>
      {entries.length === 0 ? (
        <div style={{ padding: '32px 18px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#ABABAD' }}>{emptyText}</p>
        </div>
      ) : (
        <div>
          {entries.map(e => (
            <div
              key={e.id}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 18px', borderBottom: '1px solid #F5F5F5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <LeaveTypeBadge type={e.type} size="sm" />
                <Link
                  href={`/employees/${e.employeeId}`}
                  style={{ fontSize: 13, fontWeight: 600, color: '#001A21', textDecoration: 'none' }}
                >
                  {e.employeeName}
                </Link>
              </div>
              <span style={{ fontSize: 12, color: '#777777' }}>{formatDateRange(e.startDate, e.endDate)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function WhosOff({ today, upcoming }: { today: OffEntry[]; upcoming: OffEntry[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <Panel title="Off Today" entries={today} emptyText="Everyone's in today." />
      <Panel title="Upcoming Leave (Next 14 Days)" entries={upcoming} emptyText="Nothing scheduled." />
    </div>
  )
}
