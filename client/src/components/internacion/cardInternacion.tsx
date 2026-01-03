import { Edit, Trash2 } from "lucide-react"
import type { Internacion } from "../../types/types"

interface CardInternacionProps {
   internacion: Internacion
   handleEdit: (internacion: Internacion) => void
   handleDelete: (id: number) => void
}

export default function CardInternacion({ internacion, handleEdit, handleDelete }: CardInternacionProps) {
   return (
      <div
         key={internacion.id_internacion}
         className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
      >
         <div className="flex justify-between items-start mb-2">
            <div>
               <h3 className="font-bold text-lg text-slate-800">{internacion.paciente?.apellido}, {internacion.paciente?.nombre}</h3>
            </div>
            <div className="flex gap-2">
               <button
                  onClick={() => handleEdit(internacion)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
               >
                  <Edit className="w-4 h-4" />
               </button>
               <button
                  onClick={() => handleDelete(internacion.id_internacion)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
         </div>
         <div className="space-y-2 text-sm">
            <p className="text-slate-600">
               <span className="font-medium">Médico:</span> {internacion.medico?.apellido}, {internacion.medico?.nombre}
            </p>
            <p className="text-slate-600">
               <span className="font-medium">Ingreso:</span> {new Date(internacion.fecha_inicio).toLocaleDateString()}
            </p>
            {internacion.fecha_fin && (
               <p className="text-slate-600">
                  <span className="font-medium">Alta:</span> {new Date(internacion.fecha_fin).toLocaleDateString()}
               </p>
            )}
            {!internacion.fecha_fin && (
               <p className="text-green-600 font-medium">
                  <span>En curso</span>
               </p>
            )}
            
         </div>
      </div>
   )
}