'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DEFAULT_ANNUAL_ENTITLEMENT } from '@/lib/constants'

export default function EmployeeForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [startDate, setStartDate] = useState('')
  const [entitlement, setEntitlement] = useState(String(DEFAULT_ANNUAL_ENTITLEMENT))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        role,
        startDate: startDate || null,
        annualEntitlement: entitlement,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    router.push('/employees')
    router.refresh()
  }

  return (
    <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', maxWidth: 520 }}>
      <form onSubmit={handleSubmit} style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error && (
          <div style={{ background: 'rgba(222,29,28,0.06)', border: '1px solid rgba(222,29,28,0.2)', borderRadius: 2, padding: '8px 12px' }}>
            <p style={{ fontSize: 12, color: '#DE1D1C' }}>{error}</p>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
            Full Name
          </label>
          <input className="input-base" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Apostolis Georgiou" required />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
            Role <span style={{ fontWeight: 300, color: '#ABABAD' }}>(optional)</span>
          </label>
          <input className="input-base" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Mechanic, Sales, Parts" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
              Start Date <span style={{ fontWeight: 300, color: '#ABABAD' }}>(optional)</span>
            </label>
            <input className="input-base" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: 6 }}>
              Annual Entitlement
            </label>
            <input className="input-base" type="number" min={0} value={entitlement} onChange={e => setEntitlement(e.target.value)} required />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving…' : 'Add Employee'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.back()}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
