import { useForm } from "react-hook-form"
import type { Internacion } from "../../types/types"
import { internacionesAPI } from "../../lib/api"
import { X } from "lucide-react"


interface FormInternacionProps {
   internacion?: Internacion
   setShowModal: (show: boolean) => void
   onSuccess: () => void
}

export default function FormInternacion({internacion, setShowModal, onSuccess}: FormInternacionProps) {
   const {register, handleSubmit, reset, formState: { errors }, control } = useForm<any>({
      defaultValues: {
         fecha_inicio: internacion?.fecha_inicio || "",
         fecha_fin: internacion?.fecha_fin || "",
      }
   })


   const onSubmit = async (data : any) => {
      try {
         // const data = {
         //    f_ingreso: formData.f_ingreso,
         //    f_alta: formData.f_alta || null,
         //    nro_habitacion: Number.parseInt(formData.nro_habitacion),
         //    nro_historial_clinico: Number.parseInt(formData.nro_historial_clinico),
         //    observaciones: formData.observaciones,
         // }

         if (internacion) {
            await internacionesAPI.update(internacion.id_internacion, data)
         } else {
            await internacionesAPI.create(data)
         }
         onSuccess()
         
      } catch (error: any) {
         alert("Error: " + error.message)
      }
   }

      const closeAndReset = () => {
         setShowModal(false)
         reset()
      }
         
   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-bold text-slate-800">
                  {internacion ? "Editar Internación" : "Nueva Internación"}
               </h2>
               <button onClick={closeAndReset} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                  <select
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                     <option value="">Seleccione un paciente</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Habitación</label>
                  <select
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                     <option value="">Seleccione una habitación</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Ingreso</label>
                  <input
                     type="date"
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Alta (opcional)</label>
                  <input
                     type="date"
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                  <textarea
                     rows={3}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                     className="flex-1 px-4 py-2 bg-linear-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:shadow-lg"
                  >
                     {internacion ? "Actualizar" : "Crear"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}