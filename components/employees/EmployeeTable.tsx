import Link from 'next/link'

export interface EmployeeRow {
  id: string
  name: string
  role: string | null
  entitlement: number
  used: number
  remaining: number
  sickUsed: number
}

export default function EmployeeTable({ rows }: { rows: EmployeeRow[] }) {
  if (rows.length === 0) {
    return (
      <div style={{ background: 'white', border: '1px solid #E6E6E6', borderRadius: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 16px' }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: '#ABABAD' }}>No employees yet</p>
          <p style={{ fontSize: 13, color: '#C7C7C7', marginTop: 4 }}>Add your first employee to start tracking leave</p>
        </div>
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
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Role</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Entitlement</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Used</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Remaining</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Sick Days</th>
            <th style={{ ...thStyle, textAlign: 'right' }} />
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="group hover:bg-[rgba(0,155,180,0.035)]" style={{ borderBottom: '1px solid #F5F5F5' }}>
              <td style={{ padding: '11px 14px' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#001A21' }}>{r.name}</span>
              </td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#555555' }}>{r.role || '—'}</td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#555555', textAlign: 'right' }}>{r.entitlement}</td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#555555', textAlign: 'right' }}>{r.used}</td>
              <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: r.remaining <= 3 ? '#DE1D1C' : r.remaining <= 7 ? '#FA8D14' : '#27AD5F' }}>
                  {r.remaining}
                </span>
              </td>
              <td style={{ padding: '11px 14px', fontSize: 13, color: '#555555', textAlign: 'right' }}>{r.sickUsed}</td>
              <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                <Link
                  href={`/employees/${r.id}`}
                  className="opacity-0 group-hover:opacity-100"
                  style={{ fontSize: 12, fontWeight: 600, color: '#0AB9D5', textDecoration: 'none', transition: 'opacity 0.2s' }}
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
