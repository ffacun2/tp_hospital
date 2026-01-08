import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Stethoscope, Contact, Activity, ClipboardList, ChevronRight } from 'lucide-react';
import type { Internacion, Medico } from '../types/types';
import { internacionesAPI, medicosAPI } from '../lib/api';
import BackButton from '../components/ui/backButton';

export default function MedicoDetalles() {
   const { matricula } = useParams<{ matricula: string }>();
   const [medico, setMedico] = useState<Medico | null>(null);
   const [loading, setLoading] = useState(true);
   const [internaciones, setInternaciones] = useState<Internacion[] | null>(null);


   useEffect(() => {
      const fetchDetalles = async () => {
         try {
            setLoading(true);
            const data = await medicosAPI.getMedicoByMatricula(Number(matricula));
            const inter = await internacionesAPI.getIntenacionesByMedico(Number(matricula));
            setMedico(data);
            setInternaciones(inter);
         } catch (error) {
            console.error("Error cargando médico:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchDetalles();
   }, [matricula]);


   if (loading) return <div className="p-10">Cargando perfil del profesional...</div>;
   if (!medico) return <div className="p-10">Profesional no encontrado.</div>;

   return (
      <div className="p-8 bg-gray-50 min-h-screen">
         <div className="max-w-4xl mx-auto">
            <BackButton></BackButton>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               {/* Header del Perfil */}
               <div className="bg-teal-600 p-8 text-white">
                  <div className="flex items-center gap-4">
                     <div className="bg-white/20 p-4 rounded-full">
                        <Stethoscope size={40} />
                     </div>
                     <div>
                        <h1 className="text-3xl font-bold">{medico.nombre} {medico.apellido}</h1>
                        <p className="opacity-90">Matrícula Nacional: {medico.matricula}</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                  {/* Información Personal */}
                  <div className="space-y-4">
                     <h2 className="flex items-center gap-2 font-bold text-slate-800 border-b pb-2">
                        <Contact size={20} className="text-teal-600" /> Datos Personales
                     </h2>
                     <div className="grid grid-cols-2 text-sm">
                        <span className="text-slate-500">DNI:</span> <span className="font-medium">{medico.dni}</span>
                        <span className="text-slate-500">CUIL/CUIT:</span> <span className="font-medium">{medico.cuil_cuit}</span>
                        <span className="text-slate-500">Teléfono:</span> <span className="font-medium">{medico.telefono}</span>
                     </div>
                  </div>

                  {/* Especialidades */}
                  <div className="space-y-4">
                     <h2 className="flex items-center gap-2 font-bold text-slate-800 border-b pb-2">
                        <Activity size={20} className="text-teal-600" /> Especialidades
                     </h2>
                     <div className="flex flex-wrap gap-2">
                        {medico.especialidades?.map(esp => (
                           <span key={esp.id_especialidad} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">
                              {esp.nombre}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
            {/* Historial de Internaciones Vinculadas */}
            <div className="mt-8 p-8 border-t border-slate-100">
               <h2 className="flex items-center gap-2 font-bold text-slate-800 mb-6">
                  <ClipboardList size={20} className="text-teal-600" />
                  Pacientes e Internaciones a Cargo
               </h2>

               <div className="grid grid-cols-1 gap-3">
                  {internaciones && internaciones.length > 0 ? (
                     internaciones.map((internacion) => (
                        <Link
                           key={internacion.id_internacion}
                           to={`/internaciones/${internacion.id_internacion}/seguimiento`}
                           className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 transition-all duration-200"
                        >
                           <div className="flex flex-col">
                              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
                                 ID Internación: #{internacion.id_internacion}
                              </span>
                              <span className="text-lg font-medium text-slate-700">
                                 {internacion.paciente.nombre} {internacion.paciente.apellido} {/* Ajustar según tu objeto */}
                              </span>
                              <div className="flex gap-4 mt-1 text-sm text-slate-500">
                                 <span>📅 Ingreso: {new Date(internacion.fecha_inicio).toLocaleDateString()}</span>
                                 {
                                    internacion.fecha_fin ? (
                                       <span>📅 Salida: {new Date(internacion.fecha_fin).toLocaleDateString()}</span>
                                    ) : (
                                       <span>📅 Salida: En Curso</span>
                                    )
                                 }
                                 <span>🏥 Habitación: {internacion.cama?.habitacion?.num_habitacion}</span>
                                 <span>🏥 Cama: {internacion.cama?.id_cama}</span>
                                 <span>🏥 Sector: {internacion.cama?.habitacion?.sector?.tipo}</span>
                              </div>
                           </div>
                           <div className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform">
                              <ChevronRight size={24} />
                           </div>
                        </Link>
                     ))
                  ) : (
                     <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">Este profesional no posee internaciones vinculadas actualmente.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}