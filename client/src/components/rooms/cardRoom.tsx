import { Edit, Trash2 } from "lucide-react";
import type { Habitacion } from "../../types/types";

interface PropCardRoom {
   habitacion: Habitacion
   handleEdit: (Habitacion: Habitacion) => void
   handleDelete: (num_habitacion: number) => void
}
export default function CardRoom({ habitacion, handleEdit, handleDelete }: PropCardRoom) {
   return (
      <div
         key={habitacion.num_habitacion}
         className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
      >
         <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
               <h3 className="font-bold text-2xl text-slate-800">#{habitacion.num_habitacion}</h3>
               <p className="text-sm text-orange-600 font-medium mt-1">{habitacion.sector?.tipo.replace("_", " ")}</p>
               <p className="text-sm text-slate-600 mt-1">Piso: {habitacion.piso}</p>
               <p className="text-sm text-slate-600 mt-1">Orientación: {habitacion.orientacion}</p>
            </div>
            <div className="flex gap-2">
               <button
                  onClick={(e) => {
                     e.preventDefault()
                     e.stopPropagation()
                     handleEdit(habitacion)
                  }}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
               >
                  <Edit className="w-4 h-4" />
               </button>
               <button
                  onClick={(e) => {
                     e.preventDefault()
                     e.stopPropagation()
                     handleDelete(habitacion.num_habitacion)
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
               >
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
   )
}