'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Users, Building2, Trophy, Calendar, Settings, FileText, 
  ClipboardList, CreditCard, Home, Menu, X, LogOut, Volleyball, Shield
} from 'lucide-react'

// Configuración de menú por rol
const menuByRole: Record<string, MenuItem[]> = {
  FEDERACION: [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Personas', href: '/dashboard/personas', icon: Users },
    { name: 'Clubes', href: '/dashboard/clubes', icon: Building2 },
    { name: 'Temporadas', href: '/dashboard/temporadas', icon: Calendar },
    { name: 'Competiciones', href: '/dashboard/competiciones', icon: Trophy },
    { name: 'Partidos', href: '/dashboard/partidos', icon: Volleyball },
    { name: 'Facturación', href: '/dashboard/facturacion', icon: CreditCard },
    { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings },
  ],
  COMITE_ARBITROS: [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Árbitros', href: '/dashboard/personas?tipo=ARBITRO', icon: Users },
    { name: 'Designaciones', href: '/dashboard/designaciones', icon: ClipboardList },
    { name: 'Disponibilidad', href: '/dashboard/disponibilidad', icon: Calendar },
    { name: 'Liquidaciones', href: '/dashboard/liquidaciones', icon: CreditCard },
  ],
  CLUB: [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Mi Club', href: '/dashboard/mi-club', icon: Building2 },
    { name: 'Equipos', href: '/dashboard/equipos', icon: Users },
    { name: 'Jugadores', href: '/dashboard/personas?tipo=JUGADOR', icon: Users },
    { name: 'Partidos', href: '/dashboard/partidos', icon: Volleyball },
    { name: 'Documentos', href: '/dashboard/documentos', icon: FileText },
  ],
  ARBITRO: [
    { name: 'Inicio', href: '/dashboard', icon: Home },
    { name: 'Mi Disponibilidad', href: '/dashboard/mi-disponibilidad', icon: Calendar },
    { name: 'Mis Designaciones', href: '/dashboard/mis-designaciones', icon: ClipboardList },
    { name: 'Mis Liquidaciones', href: '/dashboard/mis-liquidaciones', icon: CreditCard },
  ],
}

interface MenuItem {
  name: string
  href: string
  icon: any
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"></div>
      </div>
    )
  }

  if (!user) return null

  const menuItems = menuByRole[user.rol] || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 shadow-2xl border-r border-blue-100">
            <div className="flex items-center justify-between h-16 px-5 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white shadow-lg shadow-blue-200/60 flex items-center justify-center">
                  <img src="/logo.png" alt="AutoRef" className="h-7 w-7" />
                </div>
                <span className="text-lg font-semibold text-blue-900">AutoRef</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href.split('?')[0]))
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-400/40' 
                        : 'text-blue-900/85 hover:text-blue-900 hover:bg-blue-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:block bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 border-r border-blue-100">
        <div className="flex items-center h-16 px-5 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white shadow-lg shadow-blue-200/60 flex items-center justify-center">
              <img src="/logo.png" alt="AutoRef" className="h-7 w-7" />
            </div>
            <span className="text-lg font-semibold text-blue-900">AutoRef</span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href.split('?')[0]))
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-400/40' 
                    : 'text-blue-900/85 hover:text-blue-900 hover:bg-blue-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            )
          })}
        </nav>
        
        {/* User info en sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white shadow-lg shadow-blue-200/60">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-sm font-semibold text-white">
              {user.persona ? user.persona.nombre.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900 truncate">
                {user.persona ? user.persona.nombre : user.email.split('@')[0]}
              </p>
              <p className="text-xs text-blue-700">{user.rol.replace('_', ' ')}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-blue-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex-1" />
            
            {/* Mobile user avatar */}
            <div className="lg:hidden flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-sm font-semibold text-white">
                {user.persona ? user.persona.nombre.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
