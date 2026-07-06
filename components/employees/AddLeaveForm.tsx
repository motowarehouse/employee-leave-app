'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'

export default function AddLeaveForm({ employeeId }: { employeeId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState<'ANNUAL' | 'SICK'>('ANNUAL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, type, startDate, endDate, note }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    setStartDate(''); setEndDate(''); setNote(''); setType('ANNUAL')
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  if (!open) {
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <PlusCircle size={14} strokeWidth={2} />
        Log Leave
      </button>
    )
  }

  return (
    <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <form onSubmit={handleSubmit} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ background: 'rgba(222,29,28,0.06)', border: '1px solid rgba(222,29,28,0.2)', borderRadius: 2, padding: '8px 12px' }}>
            <p style={{ fontSize: 12, color: '#DE1D1C' }}>{error}</p>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
            Leave Type
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['ANNUAL', 'SICK'] as const).map(t => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                style={{
                  flex: 1, height: 36, borderRadius: 2, cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
                  border: type === t ? '1px solid #009BB4' : '1px solid #E6E6E6',
                  background: type === t ? 'rgba(0,155,180,0.1)' : 'white',
                  color: type === t ? '#009BB4' : '#666666',
                }}
              >
                {t === 'ANNUAL' ? 'Annual Leave' : 'Sick Leave'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
              Start Date
            </label>
            <input className="input-base" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
              End Date
            </label>
            <input className="input-base" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate || undefined} required />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
            Note <span style={{ fontWeight: 300, color: '#ABABAD' }}>(optional)</span>
          </label>
          <textarea className="input-base" rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Family trip" />
        </div>

        <p style={{ fontSize: 11, color: '#ABABAD' }}>
          Weekends and public holidays are excluded automatically when calculating working days.
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving…' : 'Save Leave Entry'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
