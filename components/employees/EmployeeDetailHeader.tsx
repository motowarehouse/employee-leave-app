'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Check, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import AddLeaveForm from '@/components/employees/AddLeaveForm'

export interface EmployeeHeaderData {
  id: string
  name: string
  role: string | null
  startDate: string | null // ISO date (yyyy-mm-dd) or null
  annualEntitlement: number
}

const inputStyle: React.CSSProperties = {
  height: 34, padding: '0 10px', fontSize: 13,
  border: '1px solid #009BB4', borderRadius: 2,
  outline: 'none', fontFamily: 'inherit',
}

export default function EmployeeDetailHeader({ employee }: { employee: EmployeeHeaderData }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState({
    name: employee.name,
    role: employee.role ?? '',
    startDate: employee.startDate ?? '',
    annualEntitlement: String(employee.annualEntitlement),
  })

  function startEdit() {
    setError('')
    setDraft({
      name: employee.name,
      role: employee.role ?? '',
      startDate: employee.startDate ?? '',
      annualEntitlement: String(employee.annualEntitlement),
    })
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setError('')
  }

  async function saveEdit() {
    if (!draft.name.trim()) {
      setError('Name is required')
      return
    }
    setSaving(true)
    setError('')
    const res = await fetch(`/api/employees/${employee.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: draft.name,
        role: draft.role,
        startDate: draft.startDate || null,
        annualEntitlement: draft.annualEntitlement,
      }),
    })
    setSaving(false)
    if (!res.ok) {
      setError('Could not save — please try again.')
      return
    }
    setEditing(false)
    router.refresh()
  }

  if (editing) {
    return (
      <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, padding: '16px 18px', marginBottom: 2 }}>
        {error && (
          <div style={{ background: 'rgba(222,29,28,0.06)', border: '1px solid rgba(222,29,28,0.2)', borderRadius: 2, padding: '7px 10px', marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: '#DE1D1C' }}>{error}</p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999999', marginBottom: 5 }}>Full Name</label>
            <input style={{ ...inputStyle, width: '100%' }} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999999', marginBottom: 5 }}>Role</label>
            <input style={{ ...inputStyle, width: '100%' }} value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))} placeholder="e.g. Mechanic" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999999', marginBottom: 5 }}>Start Date</label>
            <input style={{ ...inputStyle, width: '100%' }} type="date" value={draft.startDate} onChange={e => setDraft(d => ({ ...d, startDate: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#999999', marginBottom: 5 }}>Annual Entitlement</label>
            <input style={{ ...inputStyle, width: '100%' }} type="number" min={0} value={draft.annualEntitlement} onChange={e => setDraft(d => ({ ...d, annualEntitlement: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={saveEdit} disabled={saving} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Check size={14} strokeWidth={2} />
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={cancelEdit} disabled={saving} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <X size={14} strokeWidth={2} />
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#001A21' }}>{employee.name}</h1>
          <button
            onClick={startEdit}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0AB9D5', display: 'inline-flex', padding: 4 }}
            title="Edit employee details"
          >
            <Pencil size={15} strokeWidth={1.5} />
          </button>
        </div>
        <p style={{ fontSize: 13, color: '#888888', marginTop: 2 }}>
          {employee.role || 'No role set'}
          {employee.startDate ? ` · Started ${formatDate(new Date(employee.startDate))}` : ''}
        </p>
      </div>
      <AddLeaveForm employeeId={employee.id} />
    </div>
  )
}
