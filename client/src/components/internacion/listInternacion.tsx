import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import type { Internacion, Medico, Paciente } from "../../types/types"
import { internacionesAPI, medicosAPI, pacientesAPI } from "../../lib/api"
import LoadingSpinner from "../loadingSpinner"
import CardInternacion from "./cardInternacion"
import FormInternacion from "./formInternacion"


export default function ListInternacion() {
   const [internaciones, setInternaciones] = useState<Internacion[]>([])
   const [pacientes, setPacientes] = useState<Paciente[]>([])
   const [medicos, setMedicos] = useState<Medico[]>([])
   const [filteredInternaciones, setFilteredInternaciones] = useState<Internacion[]>([])
   const [search, setSearch] = useState("")
   const [showModal, setShowModal] = useState(false)
   const [editingInternacion, setEditingInternacion] = useState<Internacion | undefined>(undefined)
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      loadData()
   }, [])

   useEffect(() => {
      const filtered = internaciones.filter(
         (i) =>
            i.paciente?.nombre?.toLowerCase().concat(i.paciente?.apellido?.toLowerCase() || "").includes(search.toLowerCase())
            || i.cama?.habitacion?.num_habitacion.toString().includes(search.toLocaleLowerCase())
            || i.cama?.nro_cama.toString().includes(search.toLocaleLowerCase())
            || i.medico?.nombre?.toLowerCase().concat(i.medico?.apellido?.toLowerCase() || "").includes(search.toLowerCase())

      )
      setFilteredInternaciones(filtered)
   }, [search, internaciones])

   const loadData = async () => {
      try {
         setLoading(true)
         const internacionesData = await internacionesAPI.getAll()
         const [pacientesData, medicosData] = await Promise.all([
            pacientesAPI.getAll(),
            medicosAPI.getAll(),
         ])

         setInternaciones(internacionesData)
         setFilteredInternaciones(internacionesData)
         setPacientes(pacientesData)
         setMedicos(medicosData)
      } catch (error: any) {
         alert("Error al cargar datos: " + error.message)
      } finally {
         setLoading(false)
      }
   }

   const handleEdit = (internacion: Internacion) => {
      setEditingInternacion(internacion)
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

   return (
      <>
         <div className="mb-6">
            <div className="mb-6 flex items-center justify-between">
               <div className="relative flex-1 mr-10">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                     type="text"
                     placeholder="Buscar por paciente o habitación..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
               </div>
               <button
                  onClick={() => {setShowModal(true);setEditingInternacion(undefined)}}
                  className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
               >
                  <Plus className="w-5 h-5" />
                  Nueva Internación
               </button>
            </div>
         </div >

         {
            loading ? (
               <LoadingSpinner />
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredInternaciones.map((internacion) => (<CardInternacion internacion={internacion} handleEdit={handleEdit} handleDelete={handleDelete}/>))}
               </div>
            )
         }

         {
            showModal && <FormInternacion internacion={editingInternacion} pacientes={pacientes} medicos={medicos} setShowModal={setShowModal} onSuccess={loadData} />
         }

      </>
   )
}