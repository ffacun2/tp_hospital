import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"
import type { Internacion, } from "../../types/types"
import LoadingSpinner from "../ui/loadingSpinner"
import CardInternacion from "./cardInternacion"
import FormInternacion from "./formInternacion"
import { Link } from "react-router-dom"
import { useInternaciones } from "../../hooks/useInternacion"
import { useMedicos } from "../../hooks/useMedico"
import { usePacientes } from "../../hooks/usePaciente"
import Error from "../ui/error"
import { useHabitacion } from "../../hooks/useHabitacion"
import { internacionesAPI } from "../../lib/api"


export default function ListInternacion() {
   const { internaciones, isLoading, isError, deleteInternacion, refetch } = useInternaciones()
   const { pacientes } = usePacientes()
   const { medicos } = useMedicos()
   const { habitaciones } = useHabitacion()

   const [search, setSearch] = useState("")
   const [showModal, setShowModal] = useState(false)
   const [editingInternacion, setEditingInternacion] = useState<Internacion | undefined>(undefined)

   const filteredInternaciones = useMemo(() => {
      return internaciones.filter((i) =>
         i.paciente?.nombre?.toLowerCase().concat(i.paciente?.apellido?.toLowerCase() || "").includes(search.toLowerCase())
         || i.cama?.habitacion?.num_habitacion.toString().includes(search.toLocaleLowerCase())
         || i.cama?.num_cama.toString().includes(search.toLocaleLowerCase())
         || i.medico?.nombre?.toLowerCase().concat(i.medico?.apellido?.toLowerCase() || "").includes(search.toLowerCase())
      )
         .sort((a, b) => {
            // 1. Veo si estan terminadas (tienen fecha_fin)
            const aTerminada = !!a.fecha_fin;
            const bTerminada = !!b.fecha_fin;
            // 2. Ordeno por estado: En curso (false) primero, Terminadas (true) después
            if (aTerminada !== bTerminada) {
               return aTerminada ? 1 : -1;
            }
            // 3. Si tienen el mismo estado, ordeno alfabéticamente por apellido
            const nombreA = `${a.paciente?.apellido} ${a.paciente?.nombre}`.toLowerCase();
            const nombreB = `${b.paciente?.apellido} ${b.paciente?.nombre}`.toLowerCase();

            return nombreA.localeCompare(nombreB);
         });
   }, [search, internaciones])

   const handleEdit = async (internacion: Internacion) => {
      const internacionDetalles = await internacionesAPI.getDetallesById(Number(internacion.id_internacion))
      setEditingInternacion(internacionDetalles)
      setShowModal(true)
   }

   const handleDelete = async (id: number) => {
      if (confirm("¿Está seguro de eliminar esta internación?")) {
         deleteInternacion(id)
      }
   }

   const toggleModal = (show: boolean, modified: boolean) => {
      setShowModal(show)
      if (modified) {
         refetch()
      }
   }

   if (isError) return <Error message="Error al conectar con el servidor." />

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
                  onClick={() => { setShowModal(true); setEditingInternacion(undefined) }}
                  className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
               >
                  <Plus className="w-5 h-5" />
                  Nueva Internación
               </button>
            </div>
         </div >

         {
            isLoading ? (
               <LoadingSpinner message="Cargando internaciones..." />
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredInternaciones.map((internacion) => (
                     <Link to={`/internaciones/${internacion.id_internacion}/seguimiento`}>
                        <CardInternacion
                           internacion={internacion}
                           handleEdit={handleEdit}
                           handleDelete={handleDelete}
                        />
                     </Link>
                  ))}
               </div>
            )
         }

         {
            showModal
            && <FormInternacion
               internacion={editingInternacion}
               pacientes={pacientes}
               medicos={medicos}
               habitaciones={habitaciones}
               setShowModal={toggleModal}
            />
         }

      </>
   )
}