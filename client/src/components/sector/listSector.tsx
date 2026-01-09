import { useEffect, useState } from "react"
import type { Sector } from "../../types/types"
import { sectoresAPI } from "../../lib/api"
import { Plus } from "lucide-react"
import LoadingSpinner from "../ui/loadingSpinner"
import CardSector from "./cardSector"
import CreateFormSector from "./formSector"
import Error from "../ui/error"


export default function ListSector() {
   const [sectores, setSectores] = useState<Sector[]>([])
   const [showModal, setShowModal] = useState(false)
   const [editingSector, setEditingSector] = useState<Sector | undefined>(undefined)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(false)

   useEffect(() => {
      loadSectores()
   }, [])

   const loadSectores = async () => {
      try {
         setLoading(true)
         const data = await sectoresAPI.getAll()
         setSectores(data)
      }
      catch (error: any) {
         alert("Error al cargar sectores: " + error.message)
         setError(true)
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

   if (error) return <Error message="Error al cargar sectores" />

   return (
      <>
         <div className="mb-6">
            <div className="mb-6 flex items-center justify-between">
               <button
                  onClick={() => { setShowModal(true); setEditingSector(undefined) }}
                  className="flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
               >
                  <Plus className="w-5 h-5" />
                  Nuevo Sector
               </button>
            </div>
         </div>

         {loading ? (
            <LoadingSpinner message="Cargando sectores..." />
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {sectores.map((sector) => (<CardSector sector={sector} handleEdit={handleEdit} handleDelete={handleDelete} />))}
            </div>
         )}

         {
            showModal && <CreateFormSector sector={editingSector} setShowModal={setShowModal} onSuccess={loadSectores} />
         }

      </>

   )
}