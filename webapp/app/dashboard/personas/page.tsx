'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, FileText } from 'lucide-react'
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
  tipo: string
  activo: boolean
  licencias: any[]
}

const tipoLabels: Record<string, string> = {
  JUGADOR: 'Jugador',
  TECNICO: 'Técnico',
  ARBITRO: 'Árbitro',
  DIRECTIVO: 'Directivo',
}

const tipoColors: Record<string, string> = {
  JUGADOR: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  TECNICO: 'bg-blue-100 text-blue-700 border border-blue-200',
  ARBITRO: 'bg-violet-100 text-violet-700 border border-violet-200',
  DIRECTIVO: 'bg-amber-100 text-amber-700 border border-amber-200',
}

export default function PersonasPage() {
  const searchParams = useSearchParams()
  const tipoFilter = searchParams.get('tipo')
  
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedTipo, setSelectedTipo] = useState<string>(tipoFilter || '')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    fetchPersonas()
  }, [selectedTipo])

  const fetchPersonas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedTipo) params.append('tipo', selectedTipo)
      
      const response = await api.get(`/api/personas?${params.toString()}`)
      setPersonas(response.data.data.personas || [])
    } catch (error) {
      console.error('Error fetching personas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPersonas()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta persona?')) return
    
    try {
      await api.delete(`/api/personas/${id}`)
      fetchPersonas()
    } catch (error) {
      console.error('Error deleting persona:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Personas</h1>
          <p className="text-slate-500 mt-1">Gestión de jugadores, técnicos, árbitros y directivos</p>
        </div>
        <a href="/dashboard/personas/nueva">
          <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/20">
            <Plus className="h-4 w-4 mr-2" />
            Nueva persona
          </Button>
        </a>
      </div>

      {/* Filtros */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, apellidos o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            >
              <option value="">Todos los tipos</option>
              <option value="JUGADOR">Jugadores</option>
              <option value="TECNICO">Técnicos</option>
              <option value="ARBITRO">Árbitros</option>
              <option value="DIRECTIVO">Directivos</option>
            </select>
            <Button type="submit" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 border border-slate-200">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500 mx-auto"></div>
            <p className="text-slate-500 mt-3">Cargando...</p>
          </div>
        ) : personas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No se encontraron personas</p>
            <a href="/dashboard/personas/nueva" className="text-indigo-600 hover:text-indigo-700 text-sm mt-2 inline-block">
              Crear nueva persona
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-4">Nombre</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-4">DNI</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-4">Tipo</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-4">Contacto</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-4">Licencias</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-4">Estado</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {personas.map((persona) => (
                  <tr key={persona.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{persona.nombre} {persona.apellidos}</p>
                        <p className="text-xs text-slate-500">{formatDate(persona.fechaNacimiento)}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{persona.dni}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${tipoColors[persona.tipo]}`}>
                        {tipoLabels[persona.tipo]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm">
                        {persona.email && <p className="text-slate-700">{persona.email}</p>}
                        {persona.telefono && <p className="text-slate-500">{persona.telefono}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">{persona.licencias?.length || 0}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${persona.activo ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        {persona.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setMenuOpen(menuOpen === persona.id ? null : persona.id)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="h-5 w-5 text-slate-400" />
                        </button>
                        {menuOpen === persona.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 z-20 overflow-hidden">
                              <a href={`/dashboard/personas/${persona.id}`} className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <Eye className="h-4 w-4 mr-3" />
                                Ver detalles
                              </a>
                              <a href={`/dashboard/personas/${persona.id}/editar`} className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <Edit className="h-4 w-4 mr-3" />
                                Editar
                              </a>
                              <a href={`/dashboard/personas/${persona.id}/licencias/nueva`} className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <FileText className="h-4 w-4 mr-3" />
                                Nueva licencia
                              </a>
                              <button
                                onClick={() => handleDelete(persona.id)}
                                className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="h-4 w-4 mr-3" />
                                Eliminar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
