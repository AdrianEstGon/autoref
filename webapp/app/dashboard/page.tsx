'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Users, Building2, Trophy, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    { name: 'Personas', value: '0', icon: Users, href: '/dashboard/personas' },
    { name: 'Clubes', value: '0', icon: Building2, href: '/dashboard/clubes' },
    { name: 'Competiciones', value: '0', icon: Trophy, href: '/dashboard/competiciones' },
    { name: 'Partidos', value: '0', icon: Calendar, href: '/dashboard/partidos' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Hola, {user?.persona ? user.persona.nombre : 'Usuario'}
        </h1>
        <p className="text-slate-500 mt-1">Panel de control</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <a
              key={stat.name}
              href={stat.href}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-lg">
                  <Icon className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* User Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-slate-800">Tu cuenta</h2>
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
            {user?.rol}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
            <p className="text-slate-700 mt-0.5">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">Estado</p>
            <p className="text-slate-700 mt-0.5 flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Activo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
