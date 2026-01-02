import { useEffect, useState } from "react"
import type { Sector } from "../../types/types"
import { sectoresAPI } from "../../lib/api"
import { Plus, Search } from "lucide-react"
import LoadingSpinner from "../loadingSpinner"
import CardSector from "./cardSector"
import CreateFormSector from "./formSector"


export default function ListSector() {
    const [sectores, setSectores] = useState<Sector[]>([])
    const [filteredSectores, setFilteredSectores] = useState<Sector[]>([])
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editingSector, setEditingSector] = useState<Sector | undefined>(undefined)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadSectores()
    }, [])
    
    useEffect(() => {
        const filtered = sectores.filter(
            (s) => s.tipo.toLowerCase().includes(search.toLowerCase()))
        setFilteredSectores(filtered)
    }, [search, sectores])

    const loadSectores = async () => {
        try {
            setLoading(true)
            const data = await sectoresAPI.getAll()
            setSectores(data)
            setFilteredSectores(data)
        } 
        catch (error: any) {
            alert("Error al cargar sectores: " + error.message)
        } 
        finally {
            setLoading(false)
        }
    }

    const handleEdit = (sector: Sector) => {
        setEditingSector(sector)
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

    return(
        <>
        <div className="mb-6">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => {setShowModal(true); setEditingSector(undefined)}}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                    <Plus className="w-5 h-5" />
                    Nuevo Sector
                </button>
            </div>
        </div>

        {loading ? (
            <LoadingSpinner/>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredSectores.map((sector) => (<CardSector sector={sector} handleEdit={handleEdit} handleDelete={handleDelete}/>))}
            </div>
          )}

          {
            showModal && <CreateFormSector sector={editingSector} setShowModal={setShowModal} onSuccess={loadSectores}/>
          }
    
        </>
        
        )
}