"use client"

import { enumsAPI, pacientesAPI } from "../../lib/api"
import { X } from "lucide-react"
import type { Paciente } from "../../types/types";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { formatToHTMLDate } from "../../utils/formatDate";

interface PropFromPacient {
   paciente?: Paciente;
   setShowModal: (boolean: boolean) => void;
   onSuccess?: () => void;
}

type PacienteFormInputs = Paciente

export default function CreateFormPacient({ paciente, setShowModal, onSuccess }: PropFromPacient) {
   const [sexOption, setSexOption] = useState<string[]>([]);
   const { register, handleSubmit, reset, formState: { errors } } = useForm<PacienteFormInputs>({
      defaultValues: {
         nombre: paciente?.nombre || "",
         apellido: paciente?.apellido || "",
         dni: paciente?.dni || Number.parseInt(""),
         fecha_nac: paciente?.fecha_nac ? formatToHTMLDate(paciente.fecha_nac) : "",
         domicilio: paciente?.domicilio || "",
         telefono: paciente?.telefono || "",
         sexo: paciente?.sexo || ""
      }
   });

   useEffect(() => {
      getEnumSex()
   }, [])

   const getEnumSex = async () => {
      try {
         const opctions = await enumsAPI.getTipoSexo()
         setSexOption(opctions)
      }
      catch (error: any) {
         alert("Error al cargar los tipos_sex: " + error.message)
      }
   }

   const onSubmit = async (data: PacienteFormInputs) => {
      try {
         if (paciente) {
            // Si editamos, extraemos el DNI y enviamos el resto
            const { dni, ...updateData } = data;
            await pacientesAPI.update(paciente.dni, updateData);
         }
         else {
            await pacientesAPI.create(data);
         }

         if (onSuccess) onSuccess();
         closeAndReset();
      }
      catch (error: any) {
         alert("Error: " + error.message);
      }
   };

   const closeAndReset = () => {
      reset();
      setShowModal(false);
   };

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-bold text-slate-800">{paciente ? "Editar Paciente" : "Nuevo Paciente"}</h2>
               <button onClick={closeAndReset} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input
                     type="text"
                     {...register("nombre", { required: "El nombre es obligatorio" })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                  <input
                     type="text"
                     {...register("apellido", { required: "El apellido es obligatorio" })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
               </div>
               {!paciente && <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
                  <input
                     type="number"
                     {...register("dni", { required: "El DNI es obligatorio" })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
               </div>}
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
                  <input
                     type="date"
                     {...register("fecha_nac", {
                        required: "La fecha es obligatoria",
                        validate: (val) => new Date(val) <= new Date() || "La fecha no puede ser futura"
                     })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sexo</label>
                  <select
                     {...register("sexo", { required: "Seleccione una opción" })}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  >
                     {!paciente && <option value="">Seleccione un sector</option>}
                     {sexOption.map((opcion) => (
                        <option key={opcion} value={opcion}>
                           {opcion.charAt(0) + opcion.slice(1).toLowerCase()}
                        </option>
                     ))}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Domicilio</label>
                  <input
                     type="text"
                     {...register("domicilio")}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefono</label>
                  <input
                     type="text"
                     {...register("telefono")}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
               </div>
               <div className="flex gap-3 pt-4">
                  <button
                     type="button"
                     onClick={closeAndReset}
                     className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                  >
                     {paciente ? "Actualizar" : "Crear"}
                  </button>
               </div>
            </form>
         </div>
      </div>
   )
}