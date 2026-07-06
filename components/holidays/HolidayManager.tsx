'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export interface HolidayRow {
  id: string
  date: string | Date
  name: string
}

export default function HolidayManager({ holidays }: { holidays: HolidayRow[] }) {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/holidays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, name }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    setDate(''); setName('')
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this public holiday?')) return
    setDeletingId(id)
    const res = await fetch(`/api/holidays/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    if (res.ok) router.refresh()
  }

  const thStyle: React.CSSProperties = {
    padding: '9px 14px', textAlign: 'left',
    fontSize: 11, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.1em',
    color: '#999999', background: '#FAFAFA',
    borderBottom: '1px solid #E6E6E6',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', maxWidth: 560 }}>
        <form onSubmit={handleSubmit} style={{ padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {error && (
            <div style={{ width: '100%', background: 'rgba(222,29,28,0.06)', border: '1px solid rgba(222,29,28,0.2)', borderRadius: 2, padding: '8px 12px' }}>
              <p style={{ fontSize: 12, color: '#DE1D1C' }}>{error}</p>
            </div>
          )}
          <div style={{ flex: '0 0 160px' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
              Date
            </label>
            <input className="input-base" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
              Name
            </label>
            <input className="input-base" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Christmas Day" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            <PlusCircle size={14} strokeWidth={2} />
            {loading ? 'Adding…' : 'Add'}
          </button>
        </form>
      </div>

      <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden', maxWidth: 560 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Name</th>
              <th style={{ ...thStyle, textAlign: 'right' }} />
            </tr>
          </thead>
          <tbody>
            {holidays.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '32px 16px', textAlign: 'center', fontSize: 13, color: '#ABABAD' }}>
                  No public holidays added yet.
                </td>
              </tr>
            ) : holidays.map(h => (
              <tr key={h.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#333333' }}>{formatDate(h.date)}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#333333' }}>{h.name}</td>
                <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleDelete(h.id)}
                    disabled={deletingId === h.id}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ABABAD', display: 'inline-flex', padding: 4 }}
                    title="Remove"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
