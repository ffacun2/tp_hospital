"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X } from "lucide-react"
import { habitacionesAPI, sectoresAPI } from "../lib/api"
import type { Habitacion, Sector } from "../types/types"



export default function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [sectores, setSectores] = useState<Sector[]>([])
  const [filteredHabitaciones, setFilteredHabitaciones] = useState<Habitacion[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nro_habitacion: "",
    cod_sector: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = habitaciones.filter(
      (h) =>
        h.nro_habitacion.toString().includes(search) || h.sector_nombre?.toLowerCase().includes(search.toLowerCase()),
    )
    setFilteredHabitaciones(filtered)
  }, [search, habitaciones])

  const loadData = async () => {
    try {
      setLoading(true)
      const [habitacionesData, sectoresData] = await Promise.all([habitacionesAPI.getAll(), sectoresAPI.getAll()])

      // Enriquecer habitaciones con nombre del sector
      const habitacionesConSector = habitacionesData.map((hab: Habitacion) => ({
        ...hab,
        sector_nombre: sectoresData.find((s: Sector) => s.cod_sector === hab.cod_sector)?.nombre,
      }))

      setHabitaciones(habitacionesConSector)
      setFilteredHabitaciones(habitacionesConSector)
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
        nro_habitacion: Number.parseInt(formData.nro_habitacion),
        cod_sector: Number.parseInt(formData.cod_sector),
      }

      if (editingId) {
        await habitacionesAPI.update(editingId, data)
      } else {
        await habitacionesAPI.create(data)
      }
      loadData()
      resetForm()
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  const handleEdit = (habitacion: Habitacion) => {
    setEditingId(habitacion.nro_habitacion)
    setFormData({
      nro_habitacion: habitacion.nro_habitacion.toString(),
      cod_sector: habitacion.cod_sector.toString(),
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta habitación?")) {
      try {
        await habitacionesAPI.delete(id)
        loadData()
      } catch (error: any) {
        alert("Error al eliminar: " + error.message)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nro_habitacion: "",
      cod_sector: "",
    })
    setEditingId(null)
    setShowModal(false)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Habitaciones</h1>
          <p className="text-slate-600 mt-1">Gestión de habitaciones del hospital</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Habitación
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por número o sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredHabitaciones.map((habitacion) => (
            <div
              key={habitacion.nro_habitacion}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-2xl text-slate-800">#{habitacion.nro_habitacion}</h3>
                  <p className="text-sm text-orange-600 font-medium mt-1">{habitacion.sector_nombre}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(habitacion)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(habitacion.nro_habitacion)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Editar Habitación" : "Nueva Habitación"}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Número de Habitación</label>
                <input
                  type="number"
                  required
                  value={formData.nro_habitacion}
                  onChange={(e) => setFormData({ ...formData, nro_habitacion: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                <select
                  required
                  value={formData.cod_sector}
                  onChange={(e) => setFormData({ ...formData, cod_sector: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Seleccione un sector</option>
                  {sectores.map((sector) => (
                    <option key={sector.cod_sector} value={sector.cod_sector}>
                      {sector.nombre}
                    </option>
                  ))}
                </select>
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
                  className="flex-1 px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg"
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
