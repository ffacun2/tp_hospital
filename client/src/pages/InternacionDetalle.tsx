import { Link, useParams } from "react-router-dom";
import type { Internacion } from "../types/types";
import { useEffect, useState } from "react";
import { internacionesAPI } from "../lib/api";
import BackButton from "../components/ui/backButton";
import FormObservacion from "../components/internacion/formObservacion";
import { formatToHTMLDate, formatToHTMLTime } from "../utils/formatDate";

export default function InternacionDetalle() {
   const { id } = useParams<{ id: string }>();
   const [internacion, setInternacion] = useState<Internacion | null>(null);
   const [loading, setLoading] = useState(true);
   const [ShowForm, setShowForm] = useState(false);

   const loadInternacion = async () => {
      try {
         setLoading(true);
         const data = await internacionesAPI.getDetallesById(Number(id));
         setInternacion(data);
      } catch (error) {
         console.error("Error loading internacion:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => { loadInternacion(); }, [id]);

   if (loading) return <div className="p-8">Cargando detalles de internación...</div>;
   if (!internacion) return <div className="p-8">No se encontró la internación.</div>;

   return (
      <>
         <div className="p-8 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">
               <h1 className="text-3xl font-bold text-slate-800 italic">Informe de Internación #{internacion.id_internacion}</h1>

               <div>
                  <BackButton />
               </div>

               {/* Fila superior: Paciente y Médico */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link to={`/pacientes/${internacion.paciente.dni}`}>
                     <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm">
                        <h2 className="font-bold text-teal-600 mb-2 uppercase text-sm">Paciente</h2>
                        <p className="text-lg font-semibold">{internacion.paciente.nombre} {internacion.paciente.apellido}</p>
                        <p className="text-slate-500 text-sm">DNI: {internacion.paciente.dni}</p>
                     </div>
                  </Link>

                  <Link to={`/medicos/${internacion.medico.matricula}`}>
                     <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm">
                        <h2 className="font-bold text-teal-600 mb-2 uppercase text-sm">Médico Responsable</h2>
                        <p className="text-lg font-semibold">{internacion.medico.nombre} {internacion.medico.apellido}</p>
                        <p className="text-slate-500 text-sm">Matrícula: {internacion.medico.matricula}</p>
                     </div>
                  </Link>
               </div>

               {/* Ubicación (Cama y Habitación) */}
               <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm">
                  <h2 className="font-bold text-teal-600 mb-4 uppercase text-sm">Ubicación Actual</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                     <div><span className="text-slate-400">Sector:</span> <p className="font-bold">{internacion.cama.habitacion.sector?.tipo}</p></div>
                     <div><span className="text-slate-400">Piso:</span> <p className="font-bold">{internacion.cama.habitacion.piso}</p></div>
                     <div><span className="text-slate-400">Habitación:</span> <p className="font-bold">{internacion.cama.habitacion.num_habitacion}</p></div>
                     <div><span className="text-slate-400">Cama:</span> <p className="font-bold">{internacion.cama.id_cama}</p></div>
                  </div>
               </div>

               {/* Seguimiento de Recorrido */}
               <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-100 p-4 border-b border-slate-300">
                     <h2 className="font-bold text-slate-700">Historial de Seguimiento</h2>
                     <button
                        onClick={() => setShowForm(true)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition-colors">
                        Nueva Observación
                     </button>
                  </div>
                  <div className="p-0">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-xs text-slate-400 border-b border-slate-200">
                              <th className="px-6 py-3 font-medium uppercase">Fecha / Hora</th>
                              <th className="px-6 py-3 font-medium uppercase">Evolución Médica</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {internacion.comentarios_recorrido?.map((com, index) => (
                              <tr key={index} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                                    {formatToHTMLDate(com.fecha)} - {formatToHTMLTime(com.fecha)}
                                 </td>
                                 <td className="px-6 py-4 text-sm text-slate-700 italic">
                                    "{com.texto}"
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>

         {
            ShowForm
            && <FormObservacion
               setShowForm={setShowForm}
               id_internacion={internacion.id_internacion}
            />
         }
      </>
   );
}