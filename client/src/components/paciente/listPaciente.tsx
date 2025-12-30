"use client"
import { useEffect, useState } from "react"
import { pacientesAPI } from "../../lib/api"
import type { Paciente } from "../../types/types"
import CardPacient from "./cardPaciente"
import { Plus, Search } from "lucide-react"
import CreateFormPacient from "./formPaciente"
import LoadingSpinner from "../loadingSpinner"

export default function ListPaciente() {
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingPacient, setEditingPaciente] = useState<Paciente | undefined>(undefined)


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
        } 
        catch (error: any) {
          alert("Error al cargar pacientes: " + error.message)
        } 
        finally {
          setLoading(false)
        }
      }

      const handleDelete = async (id: number) => {
        if (confirm("¿Está seguro de eliminar este paciente?")) {
          try {
            await pacientesAPI.delete(id)
            loadPacientes()
          } 
          catch (error: any) {
            alert("Error al eliminar: " + error.message)
          }
        }
      }

      const handleEdit = (paciente: Paciente) => {
        setEditingPaciente(paciente)
        setShowModal(true)
      }

    return (
        <>
            <div className="mb-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="relative flex-1 mr-10">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, apellido o DNI..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => {setShowModal(true); setEditingPaciente(undefined)}}
                        className="flex items-center gap-2 bg-linear-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                    <Plus className="w-5 h-5" />
                        Nuevo Paciente
                    </button>
                </div>
            </div>
            {loading ? (
                <LoadingSpinner/>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPacientes.map((paciente) => (<CardPacient paciente={paciente} handleEdit={handleEdit} handleDelete={handleDelete}/>))}
                </div>
            )}
            {
            showModal && <CreateFormPacient paciente={editingPacient} setShowModal={setShowModal} onSuccess={loadPacientes} />
            }
        </>
    
    )
}