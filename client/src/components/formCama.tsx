import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import { camasAPI } from "../lib/api"

interface PropFormRoom {
   nro_habitacion: number
   setShowModal: (boolean: boolean) => void
   onSuccess?: () => void
}

export default function CreateFormRoom({ nro_habitacion, setShowModal, onSuccess }: PropFormRoom) {
   const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
      defaultValues: {
         nro_cama: 0,
      }
   })

   const onSubmit = async (formData: any) => {
      try {
         await camasAPI.create({
            num_cama: formData.nro_cama,
            estado: "LIBRE",
            habitacion: { num_habitacion: Number(nro_habitacion) }
         })
         if (onSuccess) onSuccess()
         closeAndReset()
      }
      catch (error: any) {
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
               <h2 className="text-2xl font-bold text-slate-800">
                  Nueva Cama
               </h2>
               <button onClick={closeAndReset} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Número de Cama</label>
                  <input
                     type="number"
                     {...register("nro_cama", { required: true })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {/* {errors.nro_cama && <p className="text-xs text-red-500">{errors.nro_cama?.message}</p>} */}
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
                     className="flex-1 px-4 py-2 bg-linear-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg"
                  >
                     Agregar
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}