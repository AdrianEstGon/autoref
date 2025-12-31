'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

export default function NuevaPersonaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipoInicial = searchParams.get('tipo') || ''
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    tipo: tipoInicial,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/api/personas', {
        ...formData,
        fechaNacimiento: new Date(formData.fechaNacimiento).toISOString(),
      })
      router.push('/dashboard/personas')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la persona')
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5"

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-slate-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nueva persona</h1>
          <p className="text-slate-500 mt-1">Alta de jugador, técnico, árbitro o directivo</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Tipo de persona */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
          <label className={labelClass}>Tipo de persona *</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Seleccionar tipo</option>
            <option value="JUGADOR">Jugador</option>
            <option value="TECNICO">Técnico</option>
            <option value="ARBITRO">Árbitro</option>
            <option value="DIRECTIVO">Directivo</option>
          </select>
        </div>

        {/* Datos personales */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-800 mb-5">Datos personales</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nombre *</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Apellidos *</label>
              <input
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>DNI/NIE *</label>
              <input
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                placeholder="12345678A"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Fecha de nacimiento *</label>
              <input
                name="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-800 mb-5">Contacto</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@ejemplo.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="612345678"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-800 mb-5">Dirección</h3>
          <div className="grid gap-5">
            <div>
              <label className={labelClass}>Dirección</label>
              <input
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Calle, número, piso..."
                className={inputClass}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Ciudad</label>
                <input
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Código postal</label>
                <input
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  placeholder="28001"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/20" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar persona
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
