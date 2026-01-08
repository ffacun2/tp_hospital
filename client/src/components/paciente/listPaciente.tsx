
import { useState, useMemo } from "react"
import type { Paciente } from "../../types/types"
import CardPacient from "./cardPaciente"
import { Plus, Search, AlertCircle } from "lucide-react"
import CreateFormPacient from "./formPaciente"
import LoadingSpinner from "../loadingSpinner"
import { usePacientes } from "../../hooks/usePaciente"

export default function ListPaciente() {
   const { pacientes, isLoading, isError, deletePaciente } = usePacientes();

   const [search, setSearch] = useState("");
   const [showModal, setShowModal] = useState(false);
   const [editingPacient, setEditingPaciente] = useState<Paciente | undefined>(undefined);

   const filteredPacientes = useMemo(() => {
      return pacientes.filter((p) =>
         p.nombre.toLowerCase().includes(search.toLowerCase()) ||
         p.apellido.toLowerCase().includes(search.toLowerCase()) ||
         p.dni.toString().includes(search)
      );
   }, [search, pacientes]);

   const handleEdit = (paciente: Paciente) => {
      setEditingPaciente(paciente);
      setShowModal(true);
   };

   const handleDeleteClick = (id: number) => {
      if (confirm("¿Está seguro de eliminar este paciente?")) {
         deletePaciente(id);
      }
   };

   if (isError) return (
      <div className="flex items-center gap-2 text-red-500 p-4">
         <AlertCircle /> Error al conectar con el servidor.
      </div>
   );

   return (
      <div className="container mx-auto p-4">
         <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Buscador */}
            <div className="relative flex-1 w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input
                  type="text"
                  placeholder="Buscar por nombre, apellido o DNI..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
               />
            </div>

            {/* Botón Nuevo */}
            <button
               onClick={() => { setEditingPaciente(undefined); setShowModal(true); }}
               className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg active:scale-95 transition-all w-full md:w-auto justify-center"
            >
               <Plus className="w-5 h-5" />
               Nuevo Paciente
            </button>
         </div>

         {isLoading ? (
            <div className="flex justify-center py-20">
               <LoadingSpinner />
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredPacientes.length > 0 ? (
                  filteredPacientes.map((paciente) => (
                     <CardPacient
                        key={paciente.dni}
                        paciente={paciente}
                        handleEdit={handleEdit}
                        handleDelete={handleDeleteClick}
                     />
                  ))
               ) : (
                  <p className="col-span-full text-center text-slate-500 py-10">
                     No se encontraron pacientes que coincidan con la búsqueda.
                  </p>
               )}
            </div>
         )}

         {/* Modal de Formulario (Crear/Editar) */}
         {showModal && (
            <CreateFormPacient
               paciente={editingPacient}
               setShowModal={setShowModal}
            />
         )}
      </div>
   )
}