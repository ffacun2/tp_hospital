import { useForm } from "react-hook-form";
import { medicosAPI } from "../../lib/api";
import type { Medico } from "../../types/types";
import { X } from "lucide-react";



interface PropFormMedic {
    medico?: Medico;
    setShowModal: (boolean:boolean) => void;
    onSuccess?: () => void;
}

type MedicFormInputs = Medico

export default function CreateFormMedic({medico, setShowModal, onSuccess}:PropFormMedic) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<MedicFormInputs>({
        defaultValues: {
            dni: medico?.dni || Number.parseInt(""),
            nombre: medico?.nombre || "",
            apellido: medico?.apellido || "",
            matricula: medico?.matricula || Number.parseInt(""),
            especialidad: medico?.especialidad || "",
            cuil_cuit: medico?.cuil_cuit || Number.parseInt(""),
            telefono : medico?.telefono || ""
        }
    });


    const onSubmit = async (data: MedicFormInputs) => {
        try {
          if (medico) {
            const {matricula, ...updateData} = data;
            await medicosAPI.update(matricula, updateData)
          } else {
            await medicosAPI.create(data)
          }
          if (onSuccess) onSuccess()
          closeAndReset()
        } catch (error: any) {
          alert("Error: " + error.message)
        }
      }

      const closeAndReset = () => {
        reset();
        setShowModal(false);
      };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">{medico ? "Editar Médico" : "Nuevo Médico"}</h2>
              <button onClick={closeAndReset} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {!medico && <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
                <input
                  type="number"
                  {...register("dni", {required: "el DNI es obligatorio."})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  {...register("nombre", {required: "El nombre es obligatorio."})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                <input
                  type="text"
                  {...register("apellido", {required: "El apellido es obligatorio."})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              {!medico && <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Matricula</label>
                <input
                  type="number"
                  {...register("matricula", {required: "La matricula es obligatoria."})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>}
              
              {!medico && <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CUIL/CUIT</label>
                <input
                  type="number"
                  {...register("cuil_cuit",{required: "El cuil-cuit es obligatorio."})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
              </div>
            }
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Especialidad</label>
                <input
                  type="text"
                  
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  {...register("telefono")}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeAndReset}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-linear-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:shadow-lg"
                >
                  {medico ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
    )
}