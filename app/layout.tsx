import type { Metadata, Viewport } from 'next'
// Replace the Geist import with standard fonts
import './globals.css'
import React from 'react'

export const metadata: Metadata = {
  title: 'Cyberpunk Dev Portfolio',
  description: 'A modern, cyberpunk-themed developer portfolio with interactive 3D elements',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#08f7fe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Use CSS variables for fonts instead of direct imports
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans bg-background min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
} 