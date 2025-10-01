
'use client'

import { ReactNode } from 'react'
import { SimpleNavbar } from './simple-navbar'

interface SimpleLayoutProps {
  children: ReactNode
}

export function SimpleLayout({ children }: SimpleLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SimpleNavbar />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  )
}
