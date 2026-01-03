import { useForm } from "react-hook-form"
import type { Internacion, Medico, Paciente } from "../../types/types"
import { internacionesAPI } from "../../lib/api"
import { X } from "lucide-react"
import { useEffect } from "react"
import { formatToHTMLDate } from "../../utils/formatDate"


interface FormInternacionProps {
   internacion?: Internacion
   pacientes: Paciente[]
   medicos: Medico[]
   setShowModal: (show: boolean) => void
   onSuccess: () => void
}

export default function FormInternacion({ internacion, pacientes, medicos, setShowModal, onSuccess }: FormInternacionProps) {
   const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm<any>({
      defaultValues: {
         fecha_inicio: formatToHTMLDate(internacion?.fecha_inicio) || "",
         fecha_fin: internacion?.fecha_fin && formatToHTMLDate(internacion?.fecha_fin) || "",
         dni: String(internacion?.paciente?.dni) || "",
         matricula: String(internacion?.medico?.matricula) || ""
      }
   })

   useEffect(() => {
      if (internacion) {
         reset({
            ...internacion,
            fecha_inicio: formatToHTMLDate(internacion.fecha_inicio),
            fecha_fin: internacion.fecha_fin ? formatToHTMLDate(internacion.fecha_fin) : "",
            dni: String(internacion?.paciente?.dni) || "",
            matricula: String(internacion?.medico?.matricula) || ""
         });
      }
   }, [internacion, pacientes, medicos,reset]);


   const onSubmit = async (data: any) => {
      try {

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
                     {...register("dni", { required: "El paciente es obligatorio" })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                     {internacion?.paciente && <option value="">Seleccione un paciente</option>}
                     {
                        pacientes.map((paciente) => (
                           <option
                              key={paciente.dni}
                              value={String(paciente.dni)}
                           >
                              {paciente.apellido} {paciente.nombre} - DNI: {paciente.dni}
                           </option>
                        ))
                     }
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Médico</label>
                  <select
                     {...register("matricula", { required: "El médico es obligatorio" })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                     {internacion?.medico && <option value="">Seleccione un médico</option>}
                     {
                        medicos.map((medico) => (
                           <option
                              key={medico.matricula}
                              value={String(medico.matricula)}
                           >
                              {medico.apellido} {medico.nombre} - DNI: {medico.matricula}
                           </option>
                        ))
                     }
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Ingreso</label>
                  <input
                     type="date"
                     {...register("fecha_inicio", {
                        required: "La fecha es obligatoria",
                        validate: (val) => new Date(val) <= new Date() || "La fecha no puede ser futura"
                     })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Alta (opcional)</label>
                  <input
                     type="date"
                     {...register("fecha_fin", {
                        validate: (val) => !val || new Date(val) >= new Date(getValues("fecha_inicio")) || "La fecha de alta no puede ser anterior a la de ingreso"
                     })}
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