import { camasAPI, internacionesAPI } from "../../lib/api"
import { X } from "lucide-react"
import type { Cama, Habitacion, Internacion, Medico, Paciente } from "../../types/types"
import { useForm, useWatch } from "react-hook-form"
import { useEffect, useState } from "react"
import { formatToHTMLDate } from "../../utils/formatDate"

interface FormInternacionProps {
   internacion?: Internacion
   pacientes: Paciente[]
   medicos: Medico[]
   habitaciones: Habitacion[]
   setShowModal: (show: boolean, modified: boolean) => void
}

export default function FormInternacion({ internacion, pacientes, medicos, habitaciones, setShowModal }: FormInternacionProps) {
   const [camas, setCamas] = useState<Cama[]>([])

   const { register, handleSubmit, reset, control, formState: { errors }, getValues } = useForm<any>({
      defaultValues: {
         fecha_inicio: formatToHTMLDate(internacion?.fecha_inicio) || "",
         fecha_fin: internacion?.fecha_fin ? formatToHTMLDate(internacion?.fecha_fin) : "",
         dni: String(internacion?.paciente?.dni || ""),
         matricula: String(internacion?.medico?.matricula || ""),
         habitacion: String(internacion?.cama?.habitacion?.num_habitacion || ""),
         cama: String(internacion?.cama?.num_cama || "")
      }
   })

   const habitacionSeleccionada = useWatch({
      control,
      name: "habitacion"
   });

   useEffect(() => {
      if (internacion) {
         reset({
            ...getValues(),
            cama: String((habitacionSeleccionada && internacion.cama?.num_cama) || "")
         })
      }
   }, [camas, reset])

   useEffect(() => {
      if (habitacionSeleccionada) {
         loadCamas(Number(habitacionSeleccionada))
      } else {
         setCamas([])
      }
   }, [habitacionSeleccionada]);

   const loadCamas = async (numHab: number) => {
      try {
         const data = await camasAPI.getAllByHabitacion(numHab)
         // Mapeamos solo las camas LIBRES o la que ya tiene asignada si es edición
         const mappedCamas = data
            .filter((c: Cama) => c.estado === "LIBRE" || (internacion && c.num_cama === internacion.cama.num_cama))

         setCamas(mappedCamas)
      }
      catch (error: any) {
         console.error("Error al cargar camas:", error.message)
      }
   }

   const onSubmit = async (data: any) => {
      const internacionData = {
         fecha_inicio: new Date(data.fecha_inicio),
         fecha_fin: data.fecha_fin ? new Date(data.fecha_fin) : null,
         medico: {
            matricula: data.matricula,
         },
         paciente: {
            dni: data.dni,
         },
         cama: {
            num_cama: data.cama,
            habitacion: {
               num_habitacion: data.habitacion
            }
         }
      }
      try {
         if (internacion) {
            await internacionesAPI.update(internacion.id_internacion, internacionData)
         } else {
            await internacionesAPI.create(internacionData)
         }
         closeAndReset(true);
      } catch (error: any) {
         alert("Error al guardar: " + error.message)
      }
   }

   const closeAndReset = (modified: boolean) => {
      setShowModal(false, modified)
      reset()
   }

   return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
               <h2 className="text-2xl font-bold text-slate-800">
                  {internacion ? "Editar Internación" : "Nueva Internación"}
               </h2>
               <button onClick={() => closeAndReset(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${internacion ? "grid-rows-4" : "grid-rows-3"}`}>

                  {/* Paciente */}
                  <div className="sm:order-1">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                     <select
                        {...register("dni", { required: "El paciente es obligatorio" })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                        disabled={!!internacion}
                     >
                        <option value="">Seleccione un paciente</option>
                        {pacientes.map((p) => (
                           <option key={p.dni} value={String(p.dni)}>
                              {p.apellido} {p.nombre} - DNI: {p.dni}
                           </option>
                        ))}
                     </select>
                     {errors.dni?.message && <p className="text-red-500 text-xs mt-1">{String(errors.dni.message)}</p>}
                  </div>

                  {/* Médico */}
                  <div className="sm:order-3">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Médico</label>
                     <select
                        {...register("matricula", { required: "El médico es obligatorio" })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                        disabled={!!internacion}
                     >
                        <option value="">Seleccione un médico</option>
                        {medicos.map((m) => (
                           <option key={m.matricula} value={String(m.matricula)}>
                              {m.apellido} {m.nombre} - MP: {m.matricula}
                           </option>
                        ))}
                     </select>
                     {errors.matricula?.message && <p className="text-red-500 text-xs mt-1">{String(errors.matricula.message)}</p>}
                  </div>

                  {/* Habitación */}
                  <div className="sm:order-2">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Habitación</label>
                     <select
                        {...register("habitacion", { required: "La habitación es obligatoria" })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                     >
                        <option value="">Seleccione una habitación</option>
                        {habitaciones.map((h) => (
                           <option key={h.num_habitacion} value={String(h.num_habitacion)}>
                              Hab. {h.num_habitacion} - {h.sector?.tipo}
                           </option>
                        ))}
                     </select>
                     {errors.habitacion?.message && <p className="text-red-500 text-xs mt-1">{String(errors.habitacion.message)}</p>}
                  </div>

                  {/* Cama */}
                  <div className="sm:order-4">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Cama</label>
                     <select
                        {...register("cama", { required: "La cama es obligatoria" })}
                        disabled={!habitacionSeleccionada}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                     >
                        <option value="">Seleccione una cama</option>
                        {
                           camas.map((c: Cama, index) => (
                              <option key={index} value={String(c.num_cama)}>{c.num_cama}</option>
                           ))
                        }
                     </select>
                     {errors.cama?.message && <p className="text-red-500 text-xs mt-1">{String(errors.cama.message)}</p>}
                  </div>

                  {/* Fecha de Ingreso */}
                  <div className="sm:order-5">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Ingreso</label>
                     <input
                        type="date"
                        {...register("fecha_inicio", { required: "La fecha es obligatoria" })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-400"
                        disabled={!!internacion}
                     />
                  </div>

                  {/* Fecha de Alta (Solo si existe internación previa) */}
                  {internacion && (
                     <div className="sm:order-7 sm:row-start-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Alta (Opcional)</label>
                        <input
                           type="date"
                           {...register("fecha_fin")}
                           className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                     </div>
                  )}
               </div>

               <div className="flex gap-3 pt-6">
                  <button
                     type="button"
                     onClick={() => closeAndReset(false)}
                     className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     className="flex-1 px-4 py-2 bg-linear-to-r from-indigo-500 to-blue-600 text-white rounded-lg hover:shadow-lg font-bold transition-all"
                  >
                     {internacion ? "Actualizar" : "Crear"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}