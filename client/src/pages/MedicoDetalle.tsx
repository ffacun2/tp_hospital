import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stethoscope, Contact, Activity } from 'lucide-react';
import type { Medico } from '../types/types';
import { medicosAPI } from '../lib/api';
import BackButton from '../components/backButton';

export default function MedicoDetalles() {
   const { matricula } = useParams<{ matricula: string }>();
   const [medico, setMedico] = useState<Medico | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchDetalles = async () => {
         try {
            setLoading(true);
            const data = await medicosAPI.getMedicoByMatricula(Number(matricula));
            setMedico(data);
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
         </div>
      </div>
   );
}