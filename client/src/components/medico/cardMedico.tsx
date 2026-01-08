import { Edit, Trash2 } from "lucide-react"
import type { Medico } from "../../types/types"

interface PropCardMedic {
   medico: Medico
   handleEdit: (medico: Medico) => void
   handleDelete: (matricula: number) => void
}

export default function CardMedic({ medico, handleEdit, handleDelete }: PropCardMedic) {
   return (
      <div
         key={medico.matricula}
         className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
      >
         <div className="flex justify-between items-start mb-4">
            <div>
               <h3 className="font-bold text-lg text-slate-800">
                  Dr/a. {medico.nombre} {medico.apellido}
               </h3>
               <p className="text-sm text-teal-600 font-medium">{medico.especialidades?.map(esp => esp.nombre).join(', ')}</p>
            </div>
            <div className="flex gap-2 z-50">
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     handleEdit(medico);
                  }}

                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
               >
                  <Edit className="w-4 h-4" />
               </button>
               <button
                  onClick={(e) => {
                     e.preventDefault()
                     e.stopPropagation()
                     handleDelete(medico.matricula)
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
         </div>
         <div className="space-y-2 text-sm">
            <p className="text-slate-600">
               <span className="font-medium">DNI:</span> {medico.dni}
            </p>
            <p className="text-slate-600">
               <span className="font-medium">Matrícula:</span> {medico.matricula}
            </p>
            <p className="text-slate-600">
               <span className="font-medium">CUIL/CUIT:</span> {medico.cuil_cuit}
            </p>
            <p className="text-slate-600">
               <span className="font-medium">Teléfono:</span> {medico.telefono}
            </p>
         </div>
      </div>
   )
}