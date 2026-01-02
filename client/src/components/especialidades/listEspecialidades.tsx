import { useEffect, useState } from "react"
import type { Especialidad } from "../../types/types"
import { especialidadesAPI } from "../../lib/api"
import { Plus } from "lucide-react"
import LoadingSpinner from "../loadingSpinner"
import CardEspecialidad from "./cardEspecialidad"
import CreateFormEspecialidad from "./formEspecialidades"


export default function ListEspecialidades() {
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
    const [showModal, setShowModal] = useState(false)
    const [editingEspecialidad, setEditingEspecialidad] = useState<Especialidad | undefined>(undefined)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadEspecialidades()
    }, [])
    
    const loadEspecialidades = async () => {
        try {
            setLoading(true)
            const data = await especialidadesAPI.getAll()
            setEspecialidades(data)
        } 
        catch (error: any) {
            alert("Error al cargar especialidades: " + error.message)
        } 
        finally {
            setLoading(false)
        }
    }

    const handleEdit = (especialidad: Especialidad) => {
        setEditingEspecialidad(especialidad)
        setShowModal(true)
    }
    
      const handleDelete = async (id: number) => {
        if (confirm("¿Está seguro de eliminar esta especialidad?")) {
          try {
            await especialidadesAPI.delete(id)
            loadEspecialidades()
          } catch (error: any) {
            alert("Error al eliminar: " + error.message)
          }
        }
      }

    return(
        <>
        <div className="mb-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="relative flex-1 mr-10">
                <button
                    onClick={() => {setShowModal(true); setEditingEspecialidad(undefined)}}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                    <Plus className="w-5 h-5" />
                    Nueva Especialidad
                </button>
                </div>
            </div>
        </div>

        {loading ? (
            <LoadingSpinner/>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {especialidades.map((especialidad) => (<CardEspecialidad especialidad={especialidad} handleEdit={handleEdit} handleDelete={handleDelete}/>))}
            </div>
          )}

          {
            showModal && <CreateFormEspecialidad especialidad={editingEspecialidad} setShowModal={setShowModal} onSuccess={loadEspecialidades}/>
          }
    
        </>
        
        )
}