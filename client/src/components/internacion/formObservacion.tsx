import { X } from "lucide-react";
import { useForm } from "react-hook-form";

interface FormObservacionProps {
   id_internacion: number
   setShowForm: (show: boolean) => void
}

export default function FormObservacion({ setShowForm, id_internacion }: FormObservacionProps) {
   const { register, handleSubmit, reset } = useForm<any>();


   const onSubmit = async (data: any) => {
      try {

         closeAndReset();
      } catch (error: any) {
         alert("Error: " + error.message)
      }
   }

   const closeAndReset = () => {
      setShowForm(false);
      reset();
   };
   return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-2xl font-bold text-slate-800">
                  Nueva Observación
               </h2>
               <button onClick={closeAndReset} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

               <textarea
                  {...register("texto")}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />

               {/* Botones */}
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
                     Guardar
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}