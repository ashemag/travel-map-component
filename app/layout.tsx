import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Travel Map Component',
  description: 'Interactive travel map component with Google Maps integration',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}