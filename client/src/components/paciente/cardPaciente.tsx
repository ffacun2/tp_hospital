import { Edit, Trash2 } from "lucide-react";
import type { Paciente } from "../../types/types";
import { formatToHTMLDate } from "../../utils/formatDate";

interface PropCardPacient {
    paciente: Paciente;
    handleEdit: (paciente:Paciente) => void;
    handleDelete: (nro_clinico:number) => void;
}

export default function CardPacient({paciente,handleEdit,handleDelete}: PropCardPacient) {

    return (
        <div key={paciente.dni} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {paciente.nombre} {paciente.apellido}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(paciente)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(paciente.dni)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium">DNI:</span> {paciente.dni}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Nacimiento:</span> {formatToHTMLDate(paciente.fecha_nac)}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Sexo:</span> {paciente.sexo}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Domicilio:</span> {paciente.domicilio}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Teléfono:</span> {paciente.telefono}
                </p>
              </div>
            </div>
    )
}