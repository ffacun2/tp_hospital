import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, Phone, User, Activity, History } from "lucide-react";
import LoadingSpinner from "../components/ui/loadingSpinner";
import { formatToHTMLDate } from "../utils/formatDate"; // Tu utilidad de formato
import { useEffect, useState } from "react";
import type { Internacion, Paciente } from "../types/types";
import BackButton from "../components/ui/backButton";
import { internacionesAPI, pacientesAPI } from "../lib/api";

export default function PacienteDetalle() {
   const { dni } = useParams<{ dni: string }>();
   const [paciente, setPaciente] = useState<Paciente | null>(null);
   const [loading, setLoading] = useState(true);
   const [internaciones, setInternaciones] = useState<Internacion[]>([]);

   useEffect(() => {
      const fetchPaciente = async () => {
         try {
            setLoading(true);
            const data = await pacientesAPI.getById(Number(dni));
            const inter = await internacionesAPI.getIntenacionesByDni(Number(dni));
            setPaciente(data);
            setInternaciones(inter);
            setLoading(false);
         } catch (error) {
            console.error('Error al cargar el paciente:', error);
            setLoading(false);
         }
      };

      fetchPaciente();
   }, [dni]);

   if (loading) return <LoadingSpinner />;
   if (!paciente) return <div className="p-10">Profesional no encontrado.</div>;

   return (
      <div className="container mx-auto p-6 max-w-5xl">
         {/* Botón Volver */}
         <BackButton />

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* COLUMNA IZQUIERDA: Ficha Personal */}
            <div className="lg:col-span-1 space-y-6">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                     <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <User size={48} />
                     </div>
                     <h1 className="text-2xl font-bold text-slate-800">{paciente.nombre} {paciente.apellido}</h1>
                     <span className="text-sm text-slate-500 font-medium">DNI: {paciente.dni}</span>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                     <div className="flex items-center gap-3 text-slate-600">
                        <Calendar size={18} className="text-blue-500" />
                        <div>
                           <p className="text-xs text-slate-400">Fecha de Nacimiento</p>
                           <p className="text-sm font-medium">{formatToHTMLDate(paciente.fecha_nac)}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 text-slate-600">
                        <Activity size={18} className="text-blue-500" />
                        <div>
                           <p className="text-xs text-slate-400">Sexo</p>
                           <p className="text-sm font-medium uppercase">{paciente.sexo}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 text-slate-600">
                        <Phone size={18} className="text-blue-500" />
                        <div>
                           <p className="text-xs text-slate-400">Teléfono</p>
                           <p className="text-sm font-medium">{paciente.telefono || "No registrado"}</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3 text-slate-600">
                        <MapPin size={18} className="text-blue-500" />
                        <div>
                           <p className="text-xs text-slate-400">Domicilio</p>
                           <p className="text-sm font-medium">{paciente.domicilio || "No registrado"}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* COLUMNA DERECHA: Historial de Internaciones */}
            <div className="lg:col-span-2">
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-full">
                  <div className="flex items-center gap-2 mb-8 border-b pb-4">
                     <History className="text-blue-600" />
                     <h2 className="text-xl font-bold text-slate-800">Historial Clínico</h2>
                  </div>

                  {internaciones.length === 0 ? (
                     <div className="text-center py-20 text-slate-400">
                        <p>Este paciente no registra internaciones previas.</p>
                     </div>
                  ) : (
                     <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                        {internaciones.map((internacion: Internacion) => (
                           <Link to={`/internaciones/${internacion.id_internacion}/seguimiento`} key={internacion.id_internacion} className="relative pl-8">
                              {/* Puntito de la línea de tiempo */}
                              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />

                              <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-blue-200">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                       Ingreso: {formatToHTMLDate(internacion.fecha_inicio)}
                                    </span>
                                    {internacion.fecha_fin ? (
                                       <span className="text-xs font-medium text-slate-500">
                                          Alta: {formatToHTMLDate(internacion.fecha_fin)}
                                       </span>
                                    ) : (
                                       <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                                          Activa
                                       </span>
                                    )}
                                 </div>
                                 <p className="text-sm text-slate-600 mt-1">Cama: {internacion.cama.id_cama} - Sector {internacion.cama.habitacion.sector?.tipo}</p>
                                 <p className="text-xs text-slate-400 mt-3 italic">Médico a cargo: {internacion.medico.apellido}, {internacion.medico.nombre}</p>
                              </div>
                           </Link>
                        ))}
                     </div>
                  )}
               </div>
            </div>

         </div>
      </div>
   );
}