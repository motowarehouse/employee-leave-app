'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import LeaveTypeBadge from '@/components/ui/LeaveTypeBadge'
import { formatDateRange } from '@/lib/utils'

export interface LeaveHistoryRow {
  id: string
  type: 'ANNUAL' | 'SICK'
  startDate: string | Date
  endDate: string | Date
  workingDays: number
  note: string | null
}

export default function LeaveHistoryTable({ entries }: { entries: LeaveHistoryRow[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Delete this leave entry? This cannot be undone.')) return
    setDeletingId(id)
    const res = await fetch(`/api/leave/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    if (res.ok) router.refresh()
  }

  if (entries.length === 0) {
    return (
      <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, padding: '40px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#ABABAD' }}>No leave logged yet.</p>
      </div>
    )
  }

  const thStyle: React.CSSProperties = {
    padding: '9px 14px', textAlign: 'left',
    fontSize: 11, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: '#999999', background: '#FAFAFA',
    borderBottom: '1px solid #E6E6E6',
  }

  return (
    <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Dates</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Working Days</th>
            <th style={thStyle}>Note</th>
            <th style={{ ...thStyle, textAlign: 'right' }} />
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
              <td style={{ padding: '11px 14px' }}><LeaveTypeBadge type={entry.type} size="sm" /></td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#333333' }}>{formatDateRange(entry.startDate, entry.endDate)}</td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#333333', textAlign: 'right', fontWeight: 600 }}>{entry.workingDays}</td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#777777' }}>{entry.note || '—'}</td>
              <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ABABAD', display: 'inline-flex', padding: 4 }}
                  title="Delete entry"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
