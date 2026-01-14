import { useMemo, useState } from "react"
import type { Medico } from "../../types/types"
import { Plus, Search } from "lucide-react"
import CreateFormMedic from "./formMedico"
import LoadingSpinner from "../ui/loadingSpinner"
import CardMedic from "./cardMedico"
import { Link } from "react-router-dom"
import { useMedicos } from "../../hooks/useMedico"
import Error from "../ui/error"


export default function ListMedic() {
   const { medicos, isLoading, isError, deleteMedico } = useMedicos()
   const [search, setSearch] = useState("")
   const [showModal, setShowModal] = useState(false)
   const [editingMedic, setEditingMedic] = useState<Medico | undefined>(undefined)

   const filteredMedicos = useMemo(() => {
      return medicos.filter((m) =>
         m.nombre.toLowerCase().includes(search.toLowerCase())
         || m.apellido.toLowerCase().includes(search.toLowerCase())
         || m.especialidades?.map(esp => esp.nombre).join(', ').toLowerCase().includes(search.toLowerCase())
      )
   }, [search, medicos])

   const handleEdit = (medico: Medico) => {
      setEditingMedic(medico)
      setShowModal(true)
   }

   const handleDelete = async (id: number) => {
      if (confirm("¿Está seguro de eliminar este médico?")) {
         deleteMedico(id)
      }
   }

   if (isError) return <Error message="Error al conectar con el servidor." />

   return (
      <div className="container mx-auto p-4">
         <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Buscador */}
            <div className="relative flex-1 w-full">
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
               onClick={() => { setShowModal(true); setEditingMedic(undefined) }}
               className="flex items-center gap-2 bg-linear-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all w-full md:w-auto justify-center"
            >
               <Plus className="w-5 h-5" />
               Nuevo Médico
            </button>

         </div>

         {
            isLoading ? (
               <div className="flex justify-center py-20">
                  <LoadingSpinner message="Cargando médicos..." />
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMedicos.length > 0 ? (
                     filteredMedicos.map((medico) => (
                        <Link to={`/medicos/${medico.matricula}`}>
                           <CardMedic
                              key={medico.matricula}
                              medico={medico}
                              handleEdit={handleEdit}
                              handleDelete={handleDelete}
                           />
                        </Link>
                     ))
                  ) : (
                     <p className="col-span-full text-center text-slate-500 py-10">
                        No se encontraron médicos que coincidan con la búsqueda.
                     </p>
                  )}
               </div>
            )
         }

         {showModal && <CreateFormMedic medico={editingMedic} setShowModal={setShowModal} />}
      </div >
   )
}