"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, X } from "lucide-react"
import { sectoresAPI } from "../lib/api"
import type { Sector } from "../types/types"



export default function Sectores() {
  const [sectores, setSectores] = useState<Sector[]>([])
  const [filteredSectores, setFilteredSectores] = useState<Sector[]>([])
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
  })

  useEffect(() => {
    loadSectores()
  }, [])

  useEffect(() => {
    const filtered = sectores.filter((s) => s.nombre.toLowerCase().includes(search.toLowerCase()))
    setFilteredSectores(filtered)
  }, [search, sectores])

  const loadSectores = async () => {
    try {
      setLoading(true)
      const data = await sectoresAPI.getAll()
      setSectores(data)
      setFilteredSectores(data)
    } catch (error: any) {
      alert("Error al cargar sectores: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await sectoresAPI.update(editingId, formData)
      } else {
        await sectoresAPI.create(formData)
      }
      loadSectores()
      resetForm()
    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  const handleEdit = (sector: Sector) => {
    setEditingId(sector.cod_sector)
    setFormData({
      nombre: sector.nombre,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este sector?")) {
      try {
        await sectoresAPI.delete(id)
        loadSectores()
      } catch (error: any) {
        alert("Error al eliminar: " + error.message)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
    })
    setEditingId(null)
    setShowModal(false)
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sectores</h1>
          <p className="text-slate-600 mt-1">Gestión de sectores hospitalarios</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Sector
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSectores.map((sector) => (
            <div
              key={sector.cod_sector}
              className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{sector.nombre}</h3>
                  <p className="text-sm text-slate-500">Código: {sector.cod_sector}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(sector)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sector.cod_sector)}
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
              <h2 className="text-2xl font-bold text-slate-800">{editingId ? "Editar Sector" : "Nuevo Sector"}</h2>
              <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Sector</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="flex-1 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg"
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
