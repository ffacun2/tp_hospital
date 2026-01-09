import { useEffect, useState } from "react";
import type { ReporteCamas, ReporteCamasDetalle } from "../types/types";
import { reportesAPI } from "../lib/api";
import LoadingSpinner from "../components/ui/loadingSpinner";
import Error from "../components/ui/error";

export default function InformeDisponibilidad() {
   const [resumenSector, setResumenSector] = useState<ReporteCamas[]>([]);
   const [detalleUbicacion, setDetalleUbicacion] = useState<ReporteCamasDetalle[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(false);


   const fetchData = async () => {
      try {
         setLoading(true);
         const dataSector = await reportesAPI.getCamasDisponiblesResumen();
         const dataDetalle = await reportesAPI.getCamasDisponiblesDetalle();
         setResumenSector(dataSector);
         setDetalleUbicacion(dataDetalle);
      } catch (error) {
         console.error("Error fetching report data:", error);
         setError(true);
      }
      finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   if (loading) return <LoadingSpinner message="Cargando datos..." />;

   if (error) return <Error message="Error al cargar los datos" />;

   return (
      <div className="p-8 bg-white font-sans text-slate-900">
         {/* SECCIÓN RESUMEN */}
         <div className="mb-10">
            <h2 className="text-xl font-bold mb-4 italic">Resumen por Sector</h2>
            <div className="max-w-2xl overflow-hidden border border-slate-400">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-100 border-b border-slate-400">
                        <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm w-2/3">Sector</th>
                        <th className="py-2 px-4 font-bold text-sm text-center">Cantidad Libre</th>
                     </tr>
                  </thead>
                  <tbody>
                     {resumenSector.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-300 last:border-0">
                           <td className="py-2 px-4 border-r border-slate-300 font-bold text-sm">{item.sector}</td>
                           <td className="py-2 px-4 text-center text-sm">{item.cantidad_disponible}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* SECCIÓN DETALLE */}
         <div>
            <h2 className="text-xl font-bold mb-4 italic">Detalle de Ubicación</h2>
            <div className="overflow-hidden border border-slate-400">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-100 border-b border-slate-400">
                        <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm">Sector</th>
                        <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm text-center w-16">Piso</th>
                        <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm">Habitación</th>
                        <th className="py-2 px-4 border-r border-slate-400 font-bold text-sm">Cama</th>
                        <th className="py-2 px-4 font-bold text-sm">Orientación</th>
                     </tr>
                  </thead>
                  <tbody>
                     {detalleUbicacion.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-300 last:border-0 hover:bg-slate-50 transition-colors">
                           <td className="py-2 px-4 border-r border-slate-300 text-sm">{item.nombre_sector}</td>
                           <td className="py-2 px-4 border-r border-slate-300 text-sm text-center">{item.piso}</td>
                           <td className="py-2 px-4 border-r border-slate-300 text-sm">{item.num_habitacion}</td>
                           <td className="py-2 px-4 border-r border-slate-300 text-sm">{item.num_cama}</td>
                           <td className="py-2 px-4 text-sm">{item.orientacion}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};