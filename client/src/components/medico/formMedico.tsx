import { useForm, useWatch } from "react-hook-form";
import { especialidadesAPI, medicosAPI } from "../../lib/api";
import type { Especialidad, Medico } from "../../types/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface PropFormMedic {
   medico?: Medico;
   setShowModal: (boolean: boolean) => void;
   onSuccess?: () => void;
}

export default function CreateFormMedic({ medico, setShowModal, onSuccess }: PropFormMedic) {
   const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

   const { register, handleSubmit, reset, formState: { errors }, control } = useForm<any>({
      defaultValues: {
         dni: medico?.dni || undefined,
         nombre: medico?.nombre || "",
         apellido: medico?.apellido || "",
         matricula: medico?.matricula || undefined,
         cuil_cuit: medico?.cuil_cuit || undefined,
         telefono: medico?.telefono || "",
         especialidades_ids: [],
      }
   });

   const watchSelectedIds = useWatch({ control, name: "especialidades_ids" }) || [];

   useEffect(() => {
      getEspecialidades();
   }, []);

   useEffect(() => {
      if (medico) {
         const ids = medico.especialidades?.map((e: Especialidad) => String(e.id_especialidad)) || [];

         const config: any = {};
         medico.especialidades?.forEach((e: Especialidad) => {
            config[e.id_especialidad] = {
               guardia: e.guardia,
               max_guardia: e.max_guardia
            };
         });

         reset({
            ...medico,
            especialidades_ids: ids,
            config: config
         });
      }
   }, [medico, reset]);

   const getEspecialidades = async () => {
      try {
         const data = await especialidadesAPI.getAll();
         setEspecialidades(data);
      } catch (error: any) {
         alert("Error al cargar las especialidades: " + error.message);
      }
   };

   const onSubmit = async (data: any) => {
      try {
         const medicoFinal: Medico = {
            ...data,
            especialidades: data.especialidades_ids.map((id: string) => ({
               id_especialidad: Number(id),
               nombre: especialidades.find((e: any) => String(e.id_especialidad) === id)?.nombre,
               guardia: data.config?.[id]?.guardia || false,
               max_guardia: Number(data.config?.[id]?.max_guardia) || 0
            }))
         };

         if (medico) {
            const { matricula, ...payload } = medicoFinal;
            await medicosAPI.update(matricula, payload);
         } else {
            await medicosAPI.create(medicoFinal);
         }
         if (onSuccess) onSuccess();
         closeAndReset();
      } catch (error: any) {
         alert("Error: " + error.message);
      }
   };

   const closeAndReset = () => {
      reset();
      setShowModal(false);
   };

   return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg border border-slate-200">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-slate-800">
                  {medico ? "Editar Perfil Médico" : "Registro de Médico"}
               </h2>
               <button onClick={closeAndReset} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
               </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               {/* Fila: Nombre y Apellido */}
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Nombre</label>
                     <input
                        type="text"
                        {...register("nombre", { required: "Obligatorio" })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Apellido</label>
                     <input
                        type="text"
                        {...register("apellido", { required: "Obligatorio" })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                     />
                  </div>
               </div>

               {/* Fila: DNI y Matrícula */}
               {!medico && (
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">DNI</label>
                        <input
                           type="number"
                           {...register("dni", { required: true })}
                           className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Matrícula</label>
                        <input
                           type="number"
                           {...register("matricula", { required: true })}
                           className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">CUIL/CUIT</label>
                        <input
                           type="number"
                           {...register("cuil_cuit", { required: true })}
                           className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                     </div>
                  </div>
               )}

               {/* SECCIÓN DE CHECKBOXES PARA ESPECIALIDADES */}
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Especialidades del Médico</label>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border rounded-2xl bg-slate-50">
                     {especialidades.map((esp: Especialidad) => (
                        <label key={esp.id_especialidad} className="flex items-center group cursor-pointer">
                           <input
                              type="checkbox"
                              value={String(esp.id_especialidad)}
                              {...register("especialidades_ids")}
                              className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                           />
                           <span className="ml-3 text-sm text-slate-600">{esp.nombre}</span>
                        </label>
                     ))}
                  </div>
               </div>

               {/* SECCIÓN 2: Configuración de cada Especialidad seleccionada */}
               <div className="space-y-4">
                  {watchSelectedIds.length > 0 && <h3 className="text-sm font-bold text-teal-600 uppercase tracking-wider">Configuración de Guardias</h3>}
                  <div className="max-h-50 overflow-auto">

                  {watchSelectedIds.map((id: string) => {
                     const nombre = especialidades.find((e: any) => String(e.id_especialidad) === id)?.nombre;
                     return (
                        <div key={id} className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm flex items-center justify-between">
                           <span className="font-semibold text-slate-700">{nombre}</span>

                           <div className="flex items-center gap-6">
                              <label className="flex items-center gap-2 text-sm text-slate-600">
                                 <input
                                    type="checkbox"
                                    {...register(`config.${id}.guardia`)}
                                    className="rounded text-teal-500"
                                    />
                                 ¿Guardia?
                              </label>

                              <div className="flex items-center gap-2">
                                 <span className="text-xs text-slate-400">Máx:</span>
                                 <input
                                    type="number"
                                    {...register(`config.${id}.max_guardia`)}
                                    className="w-16 p-1 border-b border-slate-300 focus:border-teal-500 outline-none text-center text-sm"
                                    placeholder="0"
                                 />
                              </div>
                           </div>
                        </div>
                     );
                  })}
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Teléfono</label>
                  <input
                     type="text"
                     {...register("telefono")}
                     placeholder="+54 9..."
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
               </div>

               <div className="flex gap-3 pt-6">
                  <button
                     type="button"
                     onClick={closeAndReset}
                     className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     className="flex-1 px-4 py-2.5 bg-linear-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                     {medico ? "Guardar Cambios" : "Registrar Médico"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}