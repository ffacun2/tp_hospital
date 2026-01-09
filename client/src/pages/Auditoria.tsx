import { useEffect, useState } from "react";
import { reportesAPI } from "../lib/api";
import LoadingSpinner from "../components/ui/loadingSpinner";
import Error from "../components/ui/error";



export default function Auditoria() {
   const [reportes, setReportes] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);

   useEffect(() => {
      getReportes();
   }, [])

   const getReportes = async () => {
      try {
         setLoading(true);
         const res = await reportesAPI.getAuditoriaGuardia();
         setReportes(res);
      } catch (error) {
         console.log(error);
         setError(true);
      }
      finally {
         setLoading(false);
      }
   }

   const getEtiquetaAccion = (char: string) => {
      switch (char) {
         case 'I': return (<span style={{ color: 'green', fontWeight: 'bold' }}>ALTA (INSERT)</span>);
         case 'U': return (<span style={{ color: 'orange', fontWeight: 'bold' }}>MODIFICACIÓN (UPDATE)</span>);
         case 'D': return (<span style={{ color: 'red', fontWeight: 'bold' }}>BAJA (DELETE)</span>);
         default: return char;
      }
   };

   if (loading) {
      return <LoadingSpinner message="Cargando reportes..." />
   }

   if (error) {
      return <Error message="Error al cargar los reportes" />
   }

   return (
      <div className="p-8 bg-white font-sans text-slate-900">
         <h1 className="text-2xl font-bold mb-4">Auditoría de Guardias</h1>
         <div className="max-w-5xl overflow-hidden border border-slate-400">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-100 border-b border-slate-400">
                     <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm">Fecha y Hora</th>
                     <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm">Acción</th>
                     <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm">Usuario Sistema</th>
                     <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm">Médico Afectado</th>
                     <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm">Guardia</th>
                     <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm">Especialidad</th>
                  </tr>
               </thead>
               <tbody>
                  {reportes.map((item, idx) => (
                     <tr key={idx} className="border-b border-slate-300 last:border-0">
                        <td className="py-2 px-4 border-r border-slate-300 font-bold text-sm">
                           {item.fecha}
                        </td>
                        <td className="py-2 px-4 border-r border-slate-400 font-bold text-sm">
                           {getEtiquetaAccion(item.accion)}
                        </td>
                        <td className="py-2 px-4 border-r border-slate-400 font-bold text-sm">
                           {item.usuario}
                        </td>
                        <td className="py-2 px-4 border-r border-slate-400 font-bold text-sm">
                           <strong>{item.apellido_medico}, {item.nombre_medico}</strong><br></br>
                           <small>Mat: {item.matricula || 'N/A'} - DNI: {item.dni || 'N/A'}</small>
                        </td>
                        <td className="py-2 px-4 border-r border-slate-400 font-bold text-sm">
                           ID: {item.id_guardia}<br></br>
                           Tipo: <b>{item.t_guardia}</b>
                        </td>
                        <td className="py-2 px-4 border-r border-slate-400 font-bold text-sm">
                           {item.especialidad}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

      </div>
   )
}