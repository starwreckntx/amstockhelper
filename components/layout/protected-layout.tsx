
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Navbar } from './navbar'
import { Loader2 } from 'lucide-react'

interface ProtectedLayoutProps {
  children: ReactNode
  allowedRoles?: string[]
}

export function ProtectedLayout({ children, allowedRoles }: ProtectedLayoutProps) {
  const sessionResult = useSession()
  const router = useRouter()

  // Handle the case where useSession returns undefined during build/pre-rendering
  const session = sessionResult?.data ?? null
  const status = sessionResult?.status ?? 'loading'

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (allowedRoles && !allowedRoles.includes(session.user?.role ?? '')) {
      router.push('/dashboard')
      return
    }
  }, [session, status, router, allowedRoles])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(session.user?.role ?? '')) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  )
}
