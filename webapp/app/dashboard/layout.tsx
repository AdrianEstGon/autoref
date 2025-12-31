'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex h-14 items-center px-6">
          <a className="flex items-center space-x-2.5" href="/dashboard">
            <img src="/logo.png" alt="AutoRef" className="h-8 w-8" />
            <span className="font-semibold text-slate-800">AutoRef</span>
          </a>
          
          <nav className="ml-8 flex items-center space-x-1">
            {[
              { href: '/dashboard/personas', label: 'Personas' },
              { href: '/dashboard/clubes', label: 'Clubes' },
              { href: '/dashboard/competiciones', label: 'Competiciones' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                {user.persona ? user.persona.nombre.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-600 hidden sm:block">
                {user.persona ? user.persona.nombre : user.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  )
}
