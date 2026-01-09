import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { Habitacion } from "../../types/types";
import LoadingSpinner from "../ui/loadingSpinner";
import CardRoom from "./cardRoom";
import { habitacionesAPI } from "../../lib/api";
import CreateFormRoom from "./formRoom";
import Error from "../ui/error";


export default function ListRooms() {
   const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
   const [filteredHabitaciones, setFilteredHabitaciones] = useState<Habitacion[]>([])
   const [search, setSearch] = useState("")
   const [showModal, setShowModal] = useState(false)
   const [editingRoom, setEditingRoom] = useState<Habitacion | undefined>(undefined)
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(false)


   useEffect(() => {
      loadData()
   }, [])

   useEffect(() => {
      const filtered = habitaciones.filter(
         (h) =>
            h.num_habitacion.toString().includes(search)
            || h.sector?.tipo.toLowerCase().includes(search.toLowerCase())
            || (h.sector?.tipo && h.sector?.tipo.toLowerCase().includes(search.toLowerCase()))
            || h.piso?.toString().includes(search),
      )
      setFilteredHabitaciones(filtered)
   }, [search, habitaciones])

   const loadData = async () => {
      try {
         setLoading(true)
         const habitacionesData = await habitacionesAPI.getAll()

         setHabitaciones(habitacionesData)
      }
      catch (error: any) {
         setError(true)
      }
      finally {
         setLoading(false)
      }
   }


   const handleEdit = (habitacion: Habitacion) => {
      setEditingRoom(habitacion)
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

   if (error) return <Error message="Error al cargar las habitaciones" />


   return (
      <>
         <div className="mb-6">
            <div className="mb-6 flex items-center justify-between">
               <div className="relative flex-1 mr-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                     type="text"
                     placeholder="Buscar por número o sector..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
               </div>
               <button
                  onClick={() => { setShowModal(true); setEditingRoom(undefined) }}
                  className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
               >
                  <Plus className="w-5 h-5" />
                  Nueva Habitación
               </button>
            </div>
         </div>

         {
            loading ? (
               <LoadingSpinner message="Cargando habitaciones..." />
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredHabitaciones.map((habitacion) => (<CardRoom habitacion={habitacion} handleEdit={handleEdit} handleDelete={handleDelete} />))}
               </div>
            )
         }
         {
            showModal && <CreateFormRoom habitacion={editingRoom} setShowModal={setShowModal} onSuccess={loadData} />
         }
      </>
   )
}