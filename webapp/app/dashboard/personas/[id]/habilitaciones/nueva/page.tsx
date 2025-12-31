'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

interface Categoria {
  id: string
  nombre: string
  modalidad: { nombre: string }
}

export default function NuevaHabilitacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const [persona, setPersona] = useState<any>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  
  const [formData, setFormData] = useState({
    categoriaId: '',
    motivo: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [personaRes, categoriasRes] = await Promise.all([
        api.get(`/api/personas/${id}`),
        api.get('/api/categorias'),
      ])
      
      setPersona(personaRes.data.data.persona)
      setCategorias(categoriasRes.data.data.categorias || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await api.post('/api/habilitaciones', {
        personaId: id,
        categoriaId: formData.categoriaId,
        motivo: formData.motivo,
        fechaInicio: new Date(formData.fechaInicio).toISOString(),
        fechaFin: formData.fechaFin ? new Date(formData.fechaFin).toISOString() : null,
        aprobado: false,
      })
      router.push(`/dashboard/personas/${id}`)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Error al crear la habilitación')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Nueva habilitación</h1>
          <p className="text-slate-500 mt-1">
            Para {persona?.nombre} {persona?.apellidos}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="font-medium text-slate-800 mb-4">Datos de la habilitación</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoría superior <span className="text-red-500">*</span>
              </label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.modalidad.nombre} - {c.nombre}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Categoría a la que se habilitará a jugar/participar
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Motivo <span className="text-red-500">*</span>
              </label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Ej: Refuerzo de equipo por lesiones, completar plantilla..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fecha fin
                </label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Dejar vacío si es hasta fin de temporada
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-700">
            La habilitación se creará con estado <strong>Pendiente de aprobación</strong>. 
            Deberá ser aprobada por la Federación para hacerse efectiva.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Solicitar habilitación
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
