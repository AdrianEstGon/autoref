'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, FileText, Plus, Check, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

interface Persona {
  id: string
  nombre: string
  apellidos: string
  dni: string
  fechaNacimiento: string
  telefono: string | null
  email: string | null
  direccion: string | null
  ciudad: string | null
  codigoPostal: string | null
  tipo: string
  activo: boolean
  licencias: any[]
  habilitaciones: any[]
}

const tipoLabels: Record<string, string> = {
  JUGADOR: 'Jugador',
  TECNICO: 'Técnico',
  ARBITRO: 'Árbitro',
  DIRECTIVO: 'Directivo',
}

const estadoLicencia: Record<string, { label: string; color: string; icon: any }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 border border-yellow-200', icon: Clock },
  VALIDADA: { label: 'Validada', color: 'bg-emerald-100 text-emerald-700 border border-emerald-200', icon: Check },
  RECHAZADA: { label: 'Rechazada', color: 'bg-red-100 text-red-700 border border-red-200', icon: X },
  VENCIDA: { label: 'Vencida', color: 'bg-slate-100 text-slate-700 border border-slate-200', icon: Clock },
}

export default function PersonaDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPersona()
  }, [id])

  const fetchPersona = async () => {
    try {
      const response = await api.get(`/api/personas/${id}`)
      setPersona(response.data.data.persona)
    } catch (error) {
      console.error('Error fetching persona:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500"></div>
      </div>
    )
  }

  if (!persona) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Persona no encontrada</p>
        <button onClick={() => router.back()} className="text-indigo-600 hover:text-indigo-700 mt-2">
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {persona.nombre} {persona.apellidos}
            </h1>
            <p className="text-slate-500 mt-1">{tipoLabels[persona.tipo]} · {persona.dni}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={`/dashboard/personas/${id}/licencias/nueva`}>
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800">
              <FileText className="h-4 w-4 mr-2" />
              Nueva licencia
            </Button>
          </a>
          <a href={`/dashboard/personas/${id}/editar`}>
            <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Datos personales */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-800 mb-5">Datos personales</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Nombre completo</p>
                <p className="text-slate-800 mt-1">{persona.nombre} {persona.apellidos}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">DNI/NIE</p>
                <p className="text-slate-800 mt-1">{persona.dni}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Fecha de nacimiento</p>
                <p className="text-slate-800 mt-1">{formatDate(persona.fechaNacimiento)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Tipo</p>
                <p className="text-slate-800 mt-1">{tipoLabels[persona.tipo]}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-800 mb-5">Contacto</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                <p className="text-slate-800 mt-1">{persona.email || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Teléfono</p>
                <p className="text-slate-800 mt-1">{persona.telefono || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Dirección</p>
                <p className="text-slate-800 mt-1">
                  {persona.direccion ? `${persona.direccion}, ${persona.codigoPostal} ${persona.ciudad}` : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Licencias */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-800">Licencias</h2>
              <a href={`/dashboard/personas/${id}/licencias/nueva`} className="text-indigo-600 hover:text-indigo-700 text-sm">
                + Nueva licencia
              </a>
            </div>
            {persona.licencias?.length === 0 ? (
              <p className="text-slate-500 text-sm">Sin licencias registradas</p>
            ) : (
              <div className="space-y-3">
                {persona.licencias?.map((licencia: any) => {
                  const estado = estadoLicencia[licencia.estado]
                  const Icon = estado.icon
                  return (
                    <div key={licencia.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">
                          {licencia.modalidad?.nombre} - {licencia.categoria?.nombre}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {licencia.temporada?.nombre} · {licencia.numero || 'Sin número'}
                        </p>
                      </div>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${estado.color}`}>
                        <Icon className="h-3 w-3" />
                        {estado.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Habilitaciones */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-slate-800">Habilitaciones</h2>
              <a href={`/dashboard/personas/${id}/habilitaciones/nueva`} className="text-indigo-600 hover:text-indigo-700 text-sm">
                + Nueva habilitación
              </a>
            </div>
            {persona.habilitaciones?.length === 0 ? (
              <p className="text-slate-500 text-sm">Sin habilitaciones para categorías superiores</p>
            ) : (
              <div className="space-y-3">
                {persona.habilitaciones?.map((hab: any) => (
                  <div key={hab.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">
                        Habilitado para: {hab.categoria?.nombre}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{hab.motivo}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${hab.aprobado ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                      {hab.aprobado ? 'Aprobada' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-800 mb-5">Estado</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Persona</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${persona.activo ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  {persona.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Licencias activas</span>
                <span className="text-sm font-semibold text-slate-800">
                  {persona.licencias?.filter((l: any) => l.estado === 'VALIDADA').length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Habilitaciones</span>
                <span className="text-sm font-semibold text-slate-800">
                  {persona.habilitaciones?.filter((h: any) => h.aprobado).length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
