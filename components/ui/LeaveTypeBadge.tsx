import { LEAVE_TYPE_CONFIG } from '@/lib/constants'

export default function LeaveTypeBadge({ type, size = 'md' }: { type: 'ANNUAL' | 'SICK'; size?: 'sm' | 'md' }) {
  const cfg = LEAVE_TYPE_CONFIG[type]
  const fontSize = size === 'sm' ? 10 : 11

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
        borderRadius: 2,
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.06em',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      <span style={{ width: size === 'sm' ? 5 : 6, height: size === 'sm' ? 5 : 6, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.short}
    </span>
  )
}
