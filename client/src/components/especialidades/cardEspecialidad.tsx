import { Edit, Trash2 } from "lucide-react"
import type { Especialidad } from "../../types/types"

interface PropCardEspecialidad {
    especialidad: Especialidad
    handleEdit: (especialidad:Especialidad) => void
    handleDelete: (id_especialidad:number) => void
}

export default function CardEspecialidad({especialidad, handleEdit, handleDelete}: PropCardEspecialidad) {
    return (
        <div
            key={especialidad.id_especialidad}
            className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
        >
        <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800">{especialidad.nombre.replace("_"," ")}</h3>
            </div>
            <div className="flex gap-2">
            <button
                onClick={() => handleEdit(especialidad)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
                <Edit className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(especialidad.id_especialidad)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            </div>
        </div>
        </div>
    )
}