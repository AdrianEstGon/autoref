'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

interface Option {
  id: string
  nombre: string
}

export default function NuevaLicenciaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  
  const [persona, setPersona] = useState<any>(null)
  const [temporadas, setTemporadas] = useState<Option[]>([])
  const [modalidades, setModalidades] = useState<Option[]>([])
  const [categorias, setCategorias] = useState<Option[]>([])
  
  const [formData, setFormData] = useState({
    temporadaId: '',
    modalidadId: '',
    categoriaId: '',
    numero: '',
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [personaRes, temporadasRes, modalidadesRes, categoriasRes] = await Promise.all([
        api.get(`/api/personas/${id}`),
        api.get('/api/temporadas'),
        api.get('/api/modalidades'),
        api.get('/api/categorias'),
      ])
      
      setPersona(personaRes.data.data.persona)
      setTemporadas(temporadasRes.data.data.temporadas || [])
      setModalidades(modalidadesRes.data.data.modalidades || [])
      setCategorias(categoriasRes.data.data.categorias || [])
      
      // Pre-seleccionar temporada activa
      const activa = temporadasRes.data.data.temporadas?.find((t: any) => t.activa)
      if (activa) {
        setFormData(prev => ({ ...prev, temporadaId: activa.id }))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await api.post('/api/licencias', {
        personaId: id,
        temporadaId: formData.temporadaId,
        modalidadId: formData.modalidadId,
        categoriaId: formData.categoriaId,
        numero: formData.numero || null,
        estado: 'PENDIENTE',
      })
      router.push(`/dashboard/personas/${id}`)
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Error al crear la licencia')
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
          <h1 className="text-2xl font-semibold text-slate-800">Nueva licencia</h1>
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
          <h2 className="font-medium text-slate-800 mb-4">Datos de la licencia</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Temporada <span className="text-red-500">*</span>
              </label>
              <select
                name="temporadaId"
                value={formData.temporadaId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar temporada</option>
                {temporadas.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Modalidad <span className="text-red-500">*</span>
              </label>
              <select
                name="modalidadId"
                value={formData.modalidadId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar modalidad</option>
                {modalidades.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Categoría <span className="text-red-500">*</span>
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
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Número de licencia
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Se genera automáticamente si se deja vacío"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-slate-400 mt-1">
                Deja vacío para generar automáticamente
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            La licencia se creará con estado <strong>Pendiente</strong>. Deberá ser validada posteriormente.
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
                Crear licencia
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
