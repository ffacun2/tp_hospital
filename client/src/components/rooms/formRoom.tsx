import { useForm } from "react-hook-form"
import type { Habitacion, Sector } from "../../types/types"
import { enumsAPI, habitacionesAPI, sectoresAPI } from "../../lib/api"
import { X } from "lucide-react"
import { useEffect, useState } from "react"

interface PropFormRoom {
   habitacion?: Habitacion
   setShowModal: (boolean: boolean) => void
   onSuccess?: () => void
}

export default function CreateFormRoom({ habitacion, setShowModal, onSuccess }: PropFormRoom) {
   const [sectores, setSectores] = useState<Sector[]>([])
   const [orientaciones, setOrientaciones] = useState<string[]>([])
   const { register, handleSubmit, reset } = useForm<any>({
      defaultValues: {
         num_habitacion: habitacion ? habitacion.num_habitacion : 0,
         id_sector: habitacion ? String(habitacion.sector?.id_sector) as any : 0 as any,
         piso: habitacion ? habitacion.piso : 0,
         orientacion: habitacion ? habitacion.orientacion : "",
      }
   })

   useEffect(() => {
      loadSectores()
      loadOrientacion()
   },[]) 

   useEffect(() => {
      if (sectores.length > 0 && habitacion) {
         reset({
            ...habitacion,
            id_sector: String(habitacion.sector?.id_sector) as any,
            orientacion: String(habitacion.orientacion).toLocaleUpperCase(),
         });
      }
   }, [sectores, habitacion, reset]);

   const loadSectores = async () => {
      try {
         const data = await sectoresAPI.getAll()
         setSectores(data)
      }
      catch (error: any) {
         alert("Error al cargar sectores: " + error.message)
      }
   }

   const loadOrientacion = async () => {
      try {
         const data = await enumsAPI.getOrientacion()
         setOrientaciones(data)
      }
      catch (error: any) {
         alert("Error al cargar orientaciones: " + error.message)
      }
   }

   const onSubmit = async (formData: any) => {
      try {
         const data = {
            num_habitacion: formData.num_habitacion,
            id_sector: formData.id_sector,
            piso: formData.piso,
            orientacion: formData.orientacion,
         }

         if (habitacion) {
            await habitacionesAPI.update(habitacion.num_habitacion, data)
         }
         else {
            await habitacionesAPI.create(data)
         }
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-bold text-slate-800">
                  {habitacion ? "Editar Habitación" : "Nueva Habitación"}
               </h2>
               <button onClick={closeAndReset} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Número de Habitación</label>
                  <input
                     type="number"
                     {...register("num_habitacion", { required: true })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Número de Piso</label>
                  <input
                     type="number"
                     {...register("piso", { required: true })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                  <select
                     {...register("id_sector", { required: true })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                     {!habitacion && <option value="">Seleccione un sector</option>}
                     {sectores.map((sector) => (
                        <option key={sector.id_sector} value={String(sector.id_sector)}>
                           {sector.tipo}
                        </option>
                     ))}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Orientación</label>
                  <select
                     {...register("orientacion", { required: true })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                     {!habitacion && <option value="">Seleccione una orientación</option>}
                     {orientaciones.map((orientacion) => (
                        <option key={orientacion} value={String(orientacion).toLocaleUpperCase()}>
                           {orientacion}
                        </option>
                     ))}
                  </select>
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
                     {habitacion ? "Actualizar" : "Crear"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}