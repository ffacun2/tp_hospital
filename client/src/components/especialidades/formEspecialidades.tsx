import { useForm } from "react-hook-form"
import type { Especialidad } from "../../types/types"
import { especialidadesAPI } from "../../lib/api"
import { X } from "lucide-react"

interface PropFormEspecialidad {
   especialidad?: Especialidad
   setShowModal: (boolean: boolean) => void
   onSuccess?: () => void
}

type EspecialidadFormInputs = Especialidad

export default function CreateFormEspecialidad({ especialidad, setShowModal, onSuccess }: PropFormEspecialidad) {
   const { register, handleSubmit, reset } = useForm<EspecialidadFormInputs>({
      defaultValues: {
         nombre: especialidad?.nombre || ""
      }
   })


   const onSubmit = async (data: EspecialidadFormInputs) => {
      try {
         if (especialidad) {
            await especialidadesAPI.update(especialidad.id_especialidad, data)
         }
         else {
            await especialidadesAPI.create(data)
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-bold text-slate-800">{especialidad ? "Editar Especialidad" : "Nueva Especialidad"}</h2>
               <button onClick={closeAndReset} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Sector</label>
                  <input
                     type="text"
                     {...register("nombre", { required: "El nombre es obligatorio" })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                     className="flex-1 px-4 py-2 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg"
                  >
                     {especialidad ? "Actualizar" : "Crear"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}