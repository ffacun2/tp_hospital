import { useEffect, useState } from "react"
import type { Medico } from "../../types/types"
import { medicosAPI } from "../../lib/api"
import { Plus, Search } from "lucide-react"
import CreateFormMedic from "./formMedico"
import LoadingSpinner from "../loadingSpinner"
import CardMedic from "./cardMedico"


export default function ListMedic() {
    const [medicos, setMedicos] = useState<Medico[]>([])
    const [filteredMedicos, setFilteredMedicos] = useState<Medico[]>([])
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingMedic, setEditingMedic] = useState<Medico | undefined>(undefined)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        loadMedicos()
      }, [])

    useEffect(() => {
    const filtered = medicos.filter(
        (m) =>
        m.nombre.toLowerCase().includes(search.toLowerCase()) ||
        m.apellido.toLowerCase().includes(search.toLowerCase()) 
    )
    setFilteredMedicos(filtered)
    }, [search, medicos])

    const loadMedicos = async () => {
    try {
        setLoading(true)
        const data = await medicosAPI.getAll()
        setMedicos(data)
        setFilteredMedicos(data)
    } catch (error: any) {
        alert("Error al cargar médicos: " + error.message)
    } finally {
        setLoading(false)
    }
    }

    const handleEdit = (medico: Medico) => {
        setEditingMedic(medico)
        
        setShowModal(true)
    } 

    const handleDelete = async (id: number) => {
    if (confirm("¿Está seguro de eliminar este médico?")) {
        try {
        await medicosAPI.delete(id)
        loadMedicos()
        } catch (error: any) {
        alert("Error al eliminar: " + error.message)
        }
    }
    }

    return (
        <>
        <div className="mb-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="relative flex-1 mr-10">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, apellido o especialidad..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
                <button
                    onClick={() => {setShowModal(true); setEditingMedic(undefined)}}
                    className="flex items-center gap-2 bg-linear-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                <Plus className="w-5 h-5" />
                    Nuevo Médico
                </button>
            </div>
        </div>

      {loading ? (
        <LoadingSpinner/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedicos.map((medico) => (<CardMedic medico={medico} handleEdit={handleEdit} handleDelete={handleDelete}/>))}
        </div>
      )}
      {showModal && <CreateFormMedic medico={editingMedic} setShowModal={setShowModal} onSuccess={loadMedicos}/>}
    </>
    )
}