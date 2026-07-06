'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { formatDateRange } from '@/lib/utils'

export interface ClosureRow {
  id: string
  name: string
  startDate: string | Date
  endDate: string | Date
  workingDays: number
  employeeCount: number
}

export default function ClosureList({ closures }: { closures: ClosureRow[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Delete this shop closure? This removes the leave entry it created for every employee.')) return
    setDeletingId(id)
    const res = await fetch(`/api/closures/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    if (res.ok) router.refresh()
  }

  if (closures.length === 0) {
    return (
      <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, padding: '40px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#ABABAD' }}>No shop closures logged yet.</p>
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
            <th style={thStyle}>Closure</th>
            <th style={thStyle}>Dates</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Working Days</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Employees Affected</th>
            <th style={{ ...thStyle, textAlign: 'right' }} />
          </tr>
        </thead>
        <tbody>
          {closures.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
              <td style={{ padding: '11px 14px', fontSize: 14, fontWeight: 600, color: '#001A21' }}>{c.name}</td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#333333' }}>{formatDateRange(c.startDate, c.endDate)}</td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#333333', textAlign: 'right', fontWeight: 600 }}>{c.workingDays}</td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#333333', textAlign: 'right' }}>{c.employeeCount}</td>
              <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deletingId === c.id}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ABABAD', display: 'inline-flex', padding: 4 }}
                  title="Delete closure"
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
