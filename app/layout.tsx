import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Motowarehouse | Staff Leave',
  description: 'Employee leave management for Motowarehouse Ltd',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
