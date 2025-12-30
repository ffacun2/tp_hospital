import { Edit, Trash2 } from "lucide-react"
import type { Sector } from "../../types/types"

interface PropCardSector {
    sector: Sector
    handleEdit: (sector:Sector) => void
    handleDelete: (id_sector:number) => void
}

export default function CardSector({sector, handleEdit, handleDelete}: PropCardSector) {
    return (
        <div
            key={sector.id_sector}
            className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
        >
        <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-800">{sector.tipo.replace("_"," ")}</h3>
            </div>
            <div className="flex gap-2">
            <button
                onClick={() => handleEdit(sector)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
                <Edit className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleDelete(sector.id_sector)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </button>
            </div>
        </div>
        </div>
    )
}