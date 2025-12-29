"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X } from "lucide-react"
import { pacientesAPI } from "../lib/api"
import type { Paciente } from "../types/types"



export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    f_nac: "",
    domicilio: "",
    telefono: "",
  })

  useEffect(() => {
    loadPacientes()
  }, [])

  useEffect(() => {
    const filtered = pacientes.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.apellido.toLowerCase().includes(search.toLowerCase()) ||
        p.dni.toString().includes(search),
    )
    setFilteredPacientes(filtered)
  }, [search, pacientes])

  const loadPacientes = async () => {
    try {
      setLoading(true)
      const data = await pacientesAPI.getAll()
      setPacientes(data)
      setFilteredPacientes(data)
    } catch (error: any) {
      alert("Error al cargar pacientes: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await pacientesAPI.update(editingId, formData)
      } else {
        await pacientesAPI.create(formData)
      }
      loadPacientes()
      resetForm()
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  const handleEdit = (paciente: Paciente) => {
    setEditingId(paciente.nro_historial_clinico)
    setFormData({
      nombre: paciente.nombre,
      apellido: paciente.apellido,
      dni: paciente.dni.toString(),
      f_nac: paciente.f_nac.split("T")[0],
      domicilio: paciente.domicilio,
      telefono: paciente.telefono,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este paciente?")) {
      try {
        await pacientesAPI.delete(id)
        loadPacientes()
      } catch (error: any) {
        alert("Error al eliminar: " + error.message)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      dni: "",
      f_nac: "",
      domicilio: "",
      telefono: "",
    })
    setEditingId(null)
    setShowModal(false)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pacientes</h1>
          <p className="text-slate-600 mt-1">Gestión de pacientes del hospital</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Paciente
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPacientes.map((paciente) => (
            <div
              key={paciente.nro_historial_clinico}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {paciente.nombre} {paciente.apellido}
                  </h3>
                  <p className="text-sm text-slate-500">HC: {paciente.nro_historial_clinico}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(paciente)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(paciente.nro_historial_clinico)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium">DNI:</span> {paciente.dni}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Nacimiento:</span> {new Date(paciente.f_nac).toLocaleDateString()}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Domicilio:</span> {paciente.domicilio}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Teléfono:</span> {paciente.telefono}
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
              <h2 className="text-2xl font-bold text-slate-800">{editingId ? "Editar Paciente" : "Nuevo Paciente"}</h2>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                <input
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
                <input
                  type="number"
                  required
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  required
                  value={formData.f_nac}
                  onChange={(e) => setFormData({ ...formData, f_nac: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Domicilio</label>
                <input
                  type="text"
                  required
                  value={formData.domicilio}
                  onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg"
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
