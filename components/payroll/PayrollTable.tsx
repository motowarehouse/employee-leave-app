'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Check, X } from 'lucide-react'

export interface PayrollRow {
  id: string
  name: string
  bank: string | null
  grossSalary: number | null
  netSalary: number | null
  cashAmount: number | null
  iban: string | null
  accountNumber: string | null
}

interface EditState {
  bank: string
  grossSalary: string
  netSalary: string
  cashAmount: string
  iban: string
  accountNumber: string
}

function formatMoney(value: number | null): string {
  if (value === null || value === undefined) return '—'
  return `€${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Agreement = the total amount actually agreed with the employee
// (official net salary plus any extra paid in cash). Always derived,
// never entered directly.
function computeAgreement(netSalary: number | null, cashAmount: number | null): number | null {
  if (netSalary === null && cashAmount === null) return null
  return (netSalary ?? 0) + (cashAmount ?? 0)
}

const thStyle: React.CSSProperties = {
  padding: '9px 14px', textAlign: 'left',
  fontSize: 11, fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.1em',
  color: '#999999', background: '#FAFAFA',
  borderBottom: '1px solid #E6E6E6',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 13, color: '#333333',
}

const inputStyle: React.CSSProperties = {
  height: 32, padding: '0 8px', fontSize: 12,
  border: '1px solid #009BB4', borderRadius: 2,
  width: '100%', outline: 'none',
}

export default function PayrollTable({ rows }: { rows: PayrollRow[] }) {
  const router = useRouter()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<EditState>({ bank: '', grossSalary: '', netSalary: '', cashAmount: '', iban: '', accountNumber: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function startEdit(row: PayrollRow) {
    setEditingId(row.id)
    setError('')
    setDraft({
      bank: row.bank ?? '',
      grossSalary: row.grossSalary?.toString() ?? '',
      netSalary: row.netSalary?.toString() ?? '',
      cashAmount: row.cashAmount?.toString() ?? '',
      iban: row.iban ?? '',
      accountNumber: row.accountNumber ?? '',
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setError('')
  }

  async function saveEdit(id: string) {
    setSaving(true)
    setError('')
    const res = await fetch(`/api/employees/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bank: draft.bank,
        grossSalary: draft.grossSalary === '' ? null : Number(draft.grossSalary),
        netSalary: draft.netSalary === '' ? null : Number(draft.netSalary),
        cashAmount: draft.cashAmount === '' ? null : Number(draft.cashAmount),
        iban: draft.iban,
        accountNumber: draft.accountNumber,
      }),
    })
    setSaving(false)
    if (!res.ok) {
      setError('Could not save — please try again.')
      return
    }
    setEditingId(null)
    router.refresh()
  }

  if (rows.length === 0) {
    return (
      <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, padding: '40px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#ABABAD' }}>No employees yet — add some from the Employees page first.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {error && (
        <div style={{ background: 'rgba(222,29,28,0.06)', border: '1px solid rgba(222,29,28,0.2)', borderRadius: 2, padding: '8px 12px' }}>
          <p style={{ fontSize: 12, color: '#DE1D1C' }}>{error}</p>
        </div>
      )}
      <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1080 }}>
          <thead>
            <tr>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Bank</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Gross Salary <span style={{ fontWeight: 300 }}>(Ακάθαρτος)</span></th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Net Salary <span style={{ fontWeight: 300 }}>(Καθαρός)</span></th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Agreement</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Cash</th>
              <th style={thStyle}>IBAN</th>
              <th style={thStyle}>Account Number</th>
              <th style={{ ...thStyle, textAlign: 'right' }} />
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const isEditing = editingId === row.id
              const agreement = isEditing
                ? computeAgreement(
                    draft.netSalary === '' ? null : Number(draft.netSalary),
                    draft.cashAmount === '' ? null : Number(draft.cashAmount)
                  )
                : computeAgreement(row.netSalary, row.cashAmount)

              return (
                <tr key={row.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#001A21', whiteSpace: 'nowrap' }}>{row.name}</td>

                  {isEditing ? (
                    <>
                      <td style={tdStyle}>
                        <input style={inputStyle} value={draft.bank} onChange={e => setDraft(d => ({ ...d, bank: e.target.value }))} placeholder="e.g. Bank of Cyprus" />
                      </td>
                      <td style={tdStyle}>
                        <input style={{ ...inputStyle, textAlign: 'right' }} type="number" step="0.01" value={draft.grossSalary} onChange={e => setDraft(d => ({ ...d, grossSalary: e.target.value }))} placeholder="0.00" />
                      </td>
                      <td style={tdStyle}>
                        <input style={{ ...inputStyle, textAlign: 'right' }} type="number" step="0.01" value={draft.netSalary} onChange={e => setDraft(d => ({ ...d, netSalary: e.target.value }))} placeholder="0.00" />
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#001A21', whiteSpace: 'nowrap' }} title="Auto-calculated: Net Salary + Cash">
                        {formatMoney(agreement)}
                      </td>
                      <td style={tdStyle}>
                        <input style={{ ...inputStyle, textAlign: 'right' }} type="number" step="0.01" value={draft.cashAmount} onChange={e => setDraft(d => ({ ...d, cashAmount: e.target.value }))} placeholder="0.00" />
                      </td>
                      <td style={tdStyle}>
                        <input style={inputStyle} value={draft.iban} onChange={e => setDraft(d => ({ ...d, iban: e.target.value }))} placeholder="CY00 0000 0000..." />
                      </td>
                      <td style={tdStyle}>
                        <input style={inputStyle} value={draft.accountNumber} onChange={e => setDraft(d => ({ ...d, accountNumber: e.target.value }))} placeholder="Account number" />
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => saveEdit(row.id)}
                          disabled={saving}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#27AD5F', display: 'inline-flex', padding: 4 }}
                          title="Save"
                        >
                          <Check size={16} strokeWidth={2} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ABABAD', display: 'inline-flex', padding: 4 }}
                          title="Cancel"
                        >
                          <X size={16} strokeWidth={2} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={tdStyle}>{row.bank || '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{formatMoney(row.grossSalary)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{formatMoney(row.netSalary)}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#001A21' }} title="Auto-calculated: Net Salary + Cash">
                        {formatMoney(agreement)}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>{formatMoney(row.cashAmount)}</td>
                      <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12 }}>{row.iban || '—'}</td>
                      <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12 }}>{row.accountNumber || '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <button
                          onClick={() => startEdit(row)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0AB9D5', display: 'inline-flex', padding: 4 }}
                          title="Edit"
                        >
                          <Pencil size={14} strokeWidth={1.5} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
