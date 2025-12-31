'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Users, Building2, Trophy, Calendar, TrendingUp, ClipboardList, ArrowRight, Volleyball } from 'lucide-react'

// Estadísticas por rol
const statsByRole: Record<string, any[]> = {
  FEDERACION: [
    { name: 'Personas', value: '0', icon: Users, href: '/dashboard/personas', color: 'from-blue-500 to-indigo-600' },
    { name: 'Clubes', value: '0', icon: Building2, href: '/dashboard/clubes', color: 'from-emerald-500 to-teal-600' },
    { name: 'Competiciones', value: '0', icon: Trophy, href: '/dashboard/competiciones', color: 'from-amber-500 to-orange-600' },
    { name: 'Partidos', value: '0', icon: Volleyball, href: '/dashboard/partidos', color: 'from-pink-500 to-rose-600' },
  ],
  COMITE_ARBITROS: [
    { name: 'Árbitros', value: '0', icon: Users, href: '/dashboard/personas?tipo=ARBITRO', color: 'from-blue-500 to-indigo-600' },
    { name: 'Designaciones', value: '0', icon: ClipboardList, href: '/dashboard/designaciones', color: 'from-emerald-500 to-teal-600' },
    { name: 'Partidos', value: '0', icon: Volleyball, href: '/dashboard/partidos', color: 'from-pink-500 to-rose-600' },
  ],
  CLUB: [
    { name: 'Jugadores', value: '0', icon: Users, href: '/dashboard/personas?tipo=JUGADOR', color: 'from-blue-500 to-indigo-600' },
    { name: 'Equipos', value: '0', icon: Building2, href: '/dashboard/equipos', color: 'from-emerald-500 to-teal-600' },
    { name: 'Partidos', value: '0', icon: Volleyball, href: '/dashboard/partidos', color: 'from-pink-500 to-rose-600' },
  ],
  ARBITRO: [
    { name: 'Mis Partidos', value: '0', icon: Volleyball, href: '/dashboard/mis-designaciones', color: 'from-emerald-500 to-teal-600' },
    { name: 'Liquidaciones', value: '0', icon: TrendingUp, href: '/dashboard/mis-liquidaciones', color: 'from-amber-500 to-orange-600' },
  ],
}

// Acciones rápidas por rol
const actionsByRole: Record<string, any[]> = {
  FEDERACION: [
    { name: 'Nueva persona', href: '/dashboard/personas/nueva', icon: Users },
    { name: 'Nuevo club', href: '/dashboard/clubes/nuevo', icon: Building2 },
    { name: 'Nueva competición', href: '/dashboard/competiciones/nueva', icon: Trophy },
  ],
  COMITE_ARBITROS: [
    { name: 'Nueva designación', href: '/dashboard/designaciones/nueva', icon: ClipboardList },
    { name: 'Ver disponibilidad', href: '/dashboard/disponibilidad', icon: Calendar },
  ],
  CLUB: [
    { name: 'Inscribir jugador', href: '/dashboard/personas/nueva?tipo=JUGADOR', icon: Users },
    { name: 'Solicitar cambio', href: '/dashboard/solicitudes/nueva', icon: ClipboardList },
  ],
  ARBITRO: [
    { name: 'Informar disponibilidad', href: '/dashboard/mi-disponibilidad', icon: Calendar },
    { name: 'Nueva liquidación', href: '/dashboard/mis-liquidaciones/nueva', icon: TrendingUp },
  ],
}

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const stats = statsByRole[user.rol] || []
  const actions = actionsByRole[user.rol] || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Hola, {user.persona ? user.persona.nombre : 'Usuario'}
        </h1>
        <p className="text-slate-500 mt-2">Bienvenido a tu panel de control</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any) => {
          const Icon = stat.icon
          return (
            <a
              key={stat.name}
              href={stat.href}
              className="group relative bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.name}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="relative mt-4 flex items-center text-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                <span>Ver detalles</span>
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          )
        })}
      </div>

      {/* Acciones rápidas */}
      {actions.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Acciones rápidas</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action: any) => {
              const Icon = action.icon
              return (
                <a
                  key={action.name}
                  href={action.href}
                  className="flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-slate-600 hover:text-indigo-600 transition-all duration-200"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{action.name}</span>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* Info usuario */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">Tu cuenta</h2>
          <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold uppercase tracking-wide">
            {user.rol.replace('_', ' ')}
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
            <p className="text-slate-800">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Estado</p>
            <p className="text-slate-800 flex items-center">
              <span className="h-2 w-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Activo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
