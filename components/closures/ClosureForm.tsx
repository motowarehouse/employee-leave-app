'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2 } from 'lucide-react'

export default function ClosureForm({ employeeCount }: { employeeCount: number }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/closures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, startDate, endDate }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    setName(''); setStartDate(''); setEndDate('')
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  if (!open) {
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        <Building2 size={14} strokeWidth={2} />
        New Shop Closure
      </button>
    )
  }

  return (
    <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', maxWidth: 560 }}>
      <form onSubmit={handleSubmit} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {error && (
          <div style={{ background: 'rgba(222,29,28,0.06)', border: '1px solid rgba(222,29,28,0.2)', borderRadius: 2, padding: '8px 12px' }}>
            <p style={{ fontSize: 12, color: '#DE1D1C' }}>{error}</p>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
            Closure Name
          </label>
          <input className="input-base" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. August Shutdown, Christmas Break" required />
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

        <div style={{ background: 'rgba(0,155,180,0.06)', border: '1px solid rgba(0,155,180,0.2)', borderRadius: 2, padding: '10px 12px' }}>
          <p style={{ fontSize: 12, color: '#001A21' }}>
            This will add an <strong>Annual Leave</strong> entry for all <strong>{employeeCount}</strong> active employee{employeeCount === 1 ? '' : 's'}, deducting the working days in this range from each person's balance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Applying…' : 'Apply to Everyone'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
