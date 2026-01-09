import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Cama, Habitacion } from "../types/types";
import LoadingSpinner from "../components/ui/loadingSpinner";
import Error from "../components/ui/error";
import { camasAPI, habitacionesAPI } from "../lib/api";
import { Bed, Info, Layout, Plus, Trash2 } from "lucide-react";
import BackButton from "../components/ui/backButton";
import ConfirmModal from "../components/ui/confirmModal";
import CreateFormRoom from "../components/formCama";


export default function HabitacionDetails() {
   const { num_habitacion } = useParams<{ num_habitacion: string }>();
   const [camas, setCamas] = useState<Cama[]>([]);
   const [habitacion, setHabitacion] = useState<Habitacion | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(false);
   const [selectedCama, setSelectedCama] = useState<Cama | null>(null);
   const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
   const [showModal, setShowModal] = useState(false);



   useEffect(() => {
      loadData()
   }, [num_habitacion]);

   const loadData = async () => {
      try {
         setLoading(true)
         const habitacionData = await habitacionesAPI.getById(Number(num_habitacion))
         const camasData = await camasAPI.getAllByHabitacion(Number(num_habitacion))
         setHabitacion(habitacionData)
         setCamas(camasData)
      }
      catch (error: any) {
         setError(true)
      }
      finally {
         setLoading(false)
      }
   }

   const handleDeleteCama = async (id_cama: number | undefined) => {
      if (!id_cama) return;
      try {
         setLoading(true)
         await camasAPI.delete(id_cama)
         loadData()
      }
      catch (error: any) {
         setError(true)
      }
      finally {
         setLoading(false)
      }
   }

   if (loading) return <LoadingSpinner message="Cargando datos..." />;
   if (!habitacion) return <Error message="No se encontró la habitación." />;
   if (error) return <Error message="Error al cargar la habitación." />;

   return (
      <div className="p-8 bg-slate-50 min-h-screen">
         <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 italic">Habitación #{habitacion.num_habitacion}</h1>

            <div>
               <BackButton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

               {/* ESPECIFICACIONES DE LA HABITACIÓN */}
               <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Info size={16} /> Especificaciones
                     </h3>
                     <div className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded-xl">
                           <p className="text-xs text-slate-500">Sector</p>
                           <p className="font-semibold text-slate-700">{habitacion.sector?.tipo}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                           <p className="text-xs text-slate-500">Piso</p>
                           <p className="font-semibold text-slate-700">{habitacion.piso}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                           <p className="text-xs text-slate-500">Orientacion</p>
                           <p className="font-semibold text-slate-700">{habitacion.orientacion}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                           <p className="text-xs text-slate-500">Capacidad Total</p>
                           <p className="font-semibold text-slate-700">{camas?.length || 0} Camas</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* LISTADO DE CAMAS */}
               <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                           <Layout className="text-blue-600" size={20} /> Distribución de Camas
                        </h2>
                        <button
                           onClick={() => {
                              setShowModal(true)
                           }}
                           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-medium disabled:opacity-50"
                        >
                           <Plus size={18} /> Agregar Cama
                        </button>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {camas?.map((cama: any) => (
                           <div
                              key={cama.id_cama}
                              className={`group p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${cama.estado
                                 ? 'border-amber-100 bg-amber-50/30'
                                 : 'border-slate-100 bg-white hover:border-blue-200'
                                 }`}
                           >
                              <div className="flex justify-between items-start mb-4">
                                 <div className={`p-2 rounded-lg ${cama.estado ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                    <Bed size={24} />
                                 </div>
                                 {cama.estado === "LIBRE" && (
                                    <button
                                       onClick={() => {
                                          handleDeleteCama(cama.num_cama);
                                       }}
                                       className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                       <Trash2 size={18} />
                                    </button>
                                 )}
                              </div>

                              <div>
                                 <h4 className="font-bold text-slate-800 text-lg">Cama {cama.num_cama}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${cama.estado === "OCUPADA" ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                    <span className={`text-xs font-bold uppercase tracking-tight ${cama.estado === "OCUPADA" ? 'text-amber-600' : 'text-emerald-600'}`}>
                                       {cama.estado === "OCUPADA" ? 'Ocupada' : 'Disponible'}
                                    </span>
                                 </div>
                              </div>

                           </div>
                        ))}
                     </div>

                     {camas?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                           <Bed size={48} className="mb-4 opacity-20" />
                           <p>No hay camas registradas en esta habitación.</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {showModal && (
               <CreateFormRoom
                  nro_habitacion={Number(num_habitacion)}
                  setShowModal={setShowModal}
                  onSuccess={() => loadData()}
               />
            )}
         </div>
      </div>
   );
}