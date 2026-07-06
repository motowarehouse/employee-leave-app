export const LEAVE_TYPE_CONFIG = {
  ANNUAL: {
    label: 'Annual Leave',
    short: 'Annual',
    color: '#009BB4',
    bg: 'rgba(0,155,180,0.1)',
    border: 'rgba(0,155,180,0.3)',
  },
  SICK: {
    label: 'Sick Leave',
    short: 'Sick',
    color: '#FA8D14',
    bg: 'rgba(250,141,20,0.1)',
    border: 'rgba(250,141,20,0.3)',
  },
} as const

export const DEFAULT_ANNUAL_ENTITLEMENT = 23
