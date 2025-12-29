"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X } from "lucide-react"
import { guardiasAPI, medicosAPI, sectoresAPI } from "../lib/api"
import type { Guardia, Medico, Sector } from "../types/types"



export default function Guardias() {
  const [guardias, setGuardias] = useState<Guardia[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [sectores, setSectores] = useState<Sector[]>([])
  const [filteredGuardias, setFilteredGuardias] = useState<Guardia[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    f_inicio: "",
    f_fin: "",
    matricula: "",
    cod_sector: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = guardias.filter(
      (g) =>
        g.medico_nombre?.toLowerCase().includes(search.toLowerCase()) ||
        g.sector_nombre?.toLowerCase().includes(search.toLowerCase()),
    )
    setFilteredGuardias(filtered)
  }, [search, guardias])

  const loadData = async () => {
    try {
      setLoading(true)
      const [guardiasData, medicosData, sectoresData] = await Promise.all([
        guardiasAPI.getAll(),
        medicosAPI.getAll(),
        sectoresAPI.getAll(),
      ])

      const guardiasConInfo = guardiasData.map((guardia: Guardia) => {
        const medico = medicosData.find((m: Medico) => m.matricula === guardia.matricula)
        const sector = sectoresData.find((s: Sector) => s.cod_sector === guardia.cod_sector)
        return {
          ...guardia,
          medico_nombre: medico ? `Dr/a. ${medico.nombre} ${medico.apellido}` : "Desconocido",
          sector_nombre: sector?.nombre || "Desconocido",
        }
      })

      setGuardias(guardiasConInfo)
      setFilteredGuardias(guardiasConInfo)
      setMedicos(medicosData)
      setSectores(sectoresData)
    } catch (error: any) {
      alert("Error al cargar datos: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = {
        f_inicio: formData.f_inicio,
        f_fin: formData.f_fin,
        matricula: Number.parseInt(formData.matricula),
        cod_sector: Number.parseInt(formData.cod_sector),
      }

      if (editingId) {
        await guardiasAPI.update(editingId, data)
      } else {
        await guardiasAPI.create(data)
      }
      loadData()
      resetForm()
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  const handleEdit = (guardia: Guardia) => {
    setEditingId(guardia.nro_guardia)
    setFormData({
      f_inicio: guardia.f_inicio.split("T")[0],
      f_fin: guardia.f_fin.split("T")[0],
      matricula: guardia.matricula.toString(),
      cod_sector: guardia.cod_sector.toString(),
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta guardia?")) {
      try {
        await guardiasAPI.delete(id)
        loadData()
      } catch (error: any) {
        alert("Error al eliminar: " + error.message)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      f_inicio: "",
      f_fin: "",
      matricula: "",
      cod_sector: "",
    })
    setEditingId(null)
    setShowModal(false)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Guardias</h1>
          <p className="text-slate-600 mt-1">Planificación de guardias médicas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-linear-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Guardia
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por médico o sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGuardias.map((guardia) => (
            <div
              key={guardia.nro_guardia}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{guardia.medico_nombre}</h3>
                  <p className="text-sm text-rose-600 font-medium">{guardia.sector_nombre}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(guardia)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(guardia.nro_guardia)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium">Guardia:</span> #{guardia.nro_guardia}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Inicio:</span> {new Date(guardia.f_inicio).toLocaleDateString()}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Fin:</span> {new Date(guardia.f_fin).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">{editingId ? "Editar Guardia" : "Nueva Guardia"}</h2>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Médico</label>
                <select
                  required
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Seleccione un médico</option>
                  {medicos.map((medico) => (
                    <option key={medico.matricula} value={medico.matricula}>
                      Dr/a. {medico.nombre} {medico.apellido} (Mat: {medico.matricula})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                <select
                  required
                  value={formData.cod_sector}
                  onChange={(e) => setFormData({ ...formData, cod_sector: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Seleccione un sector</option>
                  {sectores.map((sector) => (
                    <option key={sector.cod_sector} value={sector.cod_sector}>
                      {sector.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Inicio</label>
                <input
                  type="date"
                  required
                  value={formData.f_inicio}
                  onChange={(e) => setFormData({ ...formData, f_inicio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Fin</label>
                <input
                  type="date"
                  required
                  value={formData.f_fin}
                  onChange={(e) => setFormData({ ...formData, f_fin: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-linear-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:shadow-lg"
                >
                  {editingId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
