"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X } from "lucide-react"
import { internacionesAPI, pacientesAPI, habitacionesAPI } from "../lib/api"
import type { Habitacion, Internacion, Paciente } from "../types/types"



export default function Internaciones() {
  const [internaciones, setInternaciones] = useState<Internacion[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [filteredInternaciones, setFilteredInternaciones] = useState<Internacion[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    f_ingreso: "",
    f_alta: "",
    nro_habitacion: "",
    nro_historial_clinico: "",
    observaciones: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const filtered = internaciones.filter(
      (i) =>
        i.paciente_nombre?.toLowerCase().includes(search.toLowerCase()) || i.nro_habitacion.toString().includes(search),
    )
    setFilteredInternaciones(filtered)
  }, [search, internaciones])

  const loadData = async () => {
    try {
      setLoading(true)
      const [internacionesData, pacientesData, habitacionesData] = await Promise.all([
        internacionesAPI.getAll(),
        pacientesAPI.getAll(),
        habitacionesAPI.getAll(),
      ])

      const internacionesConPaciente = internacionesData.map((int: Internacion) => {
        const paciente = pacientesData.find((p: Paciente) => p.nro_historial_clinico === int.nro_historial_clinico)
        return {
          ...int,
          paciente_nombre: paciente ? `${paciente.nombre} ${paciente.apellido}` : "Desconocido",
        }
      })

      setInternaciones(internacionesConPaciente)
      setFilteredInternaciones(internacionesConPaciente)
      setPacientes(pacientesData)
      setHabitaciones(habitacionesData)
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
        f_ingreso: formData.f_ingreso,
        f_alta: formData.f_alta || null,
        nro_habitacion: Number.parseInt(formData.nro_habitacion),
        nro_historial_clinico: Number.parseInt(formData.nro_historial_clinico),
        observaciones: formData.observaciones,
      }

      if (editingId) {
        await internacionesAPI.update(editingId, data)
      } else {
        await internacionesAPI.create(data)
      }
      loadData()
      resetForm()
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  const handleEdit = (internacion: Internacion) => {
    setEditingId(internacion.nro_internacion)
    setFormData({
      f_ingreso: internacion.f_ingreso.split("T")[0],
      f_alta: internacion.f_alta ? internacion.f_alta.split("T")[0] : "",
      nro_habitacion: internacion.nro_habitacion.toString(),
      nro_historial_clinico: internacion.nro_historial_clinico.toString(),
      observaciones: internacion.observaciones,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar esta internación?")) {
      try {
        await internacionesAPI.delete(id)
        loadData()
      } catch (error: any) {
        alert("Error al eliminar: " + error.message)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      f_ingreso: "",
      f_alta: "",
      nro_habitacion: "",
      nro_historial_clinico: "",
      observaciones: "",
    })
    setEditingId(null)
    setShowModal(false)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Internaciones</h1>
          <p className="text-slate-600 mt-1">Gestión de internaciones hospitalarias</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Internación
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por paciente o habitación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInternaciones.map((internacion) => (
            <div
              key={internacion.nro_internacion}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{internacion.paciente_nombre}</h3>
                  <p className="text-sm text-indigo-600 font-medium">Habitación {internacion.nro_habitacion}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(internacion)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(internacion.nro_internacion)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium">Internación:</span> {internacion.nro_internacion}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Ingreso:</span> {new Date(internacion.f_ingreso).toLocaleDateString()}
                </p>
                {internacion.f_alta && (
                  <p className="text-slate-600">
                    <span className="font-medium">Alta:</span> {new Date(internacion.f_alta).toLocaleDateString()}
                  </p>
                )}
                {!internacion.f_alta && (
                  <p className="text-green-600 font-medium">
                    <span>En curso</span>
                  </p>
                )}
                <p className="text-slate-600">
                  <span className="font-medium">Observaciones:</span> {internacion.observaciones}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Editar Internación" : "Nueva Internación"}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                <select
                  required
                  value={formData.nro_historial_clinico}
                  onChange={(e) => setFormData({ ...formData, nro_historial_clinico: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Seleccione un paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.nro_historial_clinico} value={paciente.nro_historial_clinico}>
                      {paciente.nombre} {paciente.apellido} (HC: {paciente.nro_historial_clinico})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Habitación</label>
                <select
                  required
                  value={formData.nro_habitacion}
                  onChange={(e) => setFormData({ ...formData, nro_habitacion: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Seleccione una habitación</option>
                  {habitaciones.map((habitacion) => (
                    <option key={habitacion.nro_habitacion} value={habitacion.nro_habitacion}>
                      Habitación {habitacion.nro_habitacion}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Ingreso</label>
                <input
                  type="date"
                  required
                  value={formData.f_ingreso}
                  onChange={(e) => setFormData({ ...formData, f_ingreso: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Alta (opcional)</label>
                <input
                  type="date"
                  value={formData.f_alta}
                  onChange={(e) => setFormData({ ...formData, f_alta: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                <textarea
                  required
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2 bg-linear-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:shadow-lg"
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
