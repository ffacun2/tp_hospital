import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home, Users, UserCog, Building, DoorOpen, Activity, Shield, BriefcaseMedical, Bed, NotepadTextDashed, Menu, X } from "lucide-react"
import Dashboard from "./pages/Dashboard"
import Pacientes from "./pages/Pacientes"
import Medicos from "./pages/Medicos"
import Sectores from "./pages/Sectores"
import Habitaciones from "./pages/Habitaciones"
import Internaciones from "./pages/Internaciones"
import Guardias from "./pages/Guardias"
import Especialidades from "./pages/Especialidades"
import InformeDisponibilidad from "./pages/InformeDisponibilidad"
import NavItem from "./components/ui/navItem"
import InternacionDetalle from "./pages/InternacionDetalle"
import MedicoDetalle from "./pages/MedicoDetalle"
import PacienteDetalle from "./pages/PacienteDetalle"
import Auditoria from "./pages/Auditoria"
import HabitacionDetails from "./pages/HabitacionDetails"
import { useState } from "react"




function Layout() {
   const [isOpen, setIsOpen] = useState(false);

   // Función para cerrar el menú
   const closeSidebar = () => setIsOpen(false);

   return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
         {/* Botón Hamburguesa para Móviles */}
         {
            !isOpen && <button
               onClick={() => setIsOpen(true)}
               className="sm:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200"
            >
               <Menu className="w-6 h-6 text-slate-600" />
            </button>
         }

         {/* Overlay para cerrar al hacer clic fuera (solo móvil) */}
         {
            isOpen && (
               <div
                  className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-600 sm:hidden"
                  onClick={closeSidebar}
               />
            )
         }

         {/* Sidebar */}
         <aside className={`
            fixed inset-y-0 left-0 z-600 sm:w-64 bg-white border-r border-slate-200 flex-col shadow-sm transition-transform duration-500 transform
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0 sm:static sm:inset-auto
         `}>
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                     <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <h1 className="text-xl font-bold text-slate-800">Hospital</h1>
                     <p className="text-xs text-slate-500">Sistema de Gestión</p>
                  </div>
               </div>
               {/* Botón cerrar para móvil */}
               <button onClick={closeSidebar} className="sm:hidden p-1">
                  <X className="w-6 h-6 text-slate-400" />
               </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
               <h4 className="px-4 py-2 text-xs text-slate-400 uppercase tracking-wider">General</h4>
               <NavItem to="/" icon={Home} label="Dashboard" onClick={closeSidebar} />
               <NavItem to="/pacientes" icon={Users} label="Pacientes" onClick={closeSidebar} />
               <NavItem to="/medicos" icon={UserCog} label="Médicos" onClick={closeSidebar} />
               <NavItem to="/especialidades" icon={BriefcaseMedical} label="Especialidades" onClick={closeSidebar} />
               <NavItem to="/sectores" icon={Building} label="Sectores" onClick={closeSidebar} />
               <NavItem to="/habitaciones" icon={DoorOpen} label="Habitaciones" onClick={closeSidebar} />
               <NavItem to="/internaciones" icon={Activity} label="Internaciones" onClick={closeSidebar} />
               <NavItem to="/guardias" icon={Shield} label="Guardias" onClick={closeSidebar} />

               <div className="pt-4">
                  <hr className="border-slate-200 mb-2" />
                  <h4 className="px-4 py-2 text-xs text-slate-400 uppercase tracking-wider">Reportes</h4>
                  <NavItem to="/camas_disponibles" icon={Bed} label="Camas Disponibles" onClick={closeSidebar} />
                  <NavItem to="/auditoria_guardia" icon={NotepadTextDashed} label="Auditoria Guardia" onClick={closeSidebar} />
               </div>
            </nav>

            <div className="p-4 border-t border-slate-200">
               <p className="text-xs text-slate-400 text-center">v1.0.0</p>
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 overflow-auto">
            <Routes>
               <Route path="/" element={<Dashboard />} />
               <Route path="/pacientes" element={<Pacientes />} />
               <Route path="/pacientes/:dni" element={<PacienteDetalle />} />
               <Route path="/medicos" element={<Medicos />} />
               <Route path="/medicos/:matricula" element={<MedicoDetalle />} />
               <Route path="/especialidades" element={<Especialidades />} />
               <Route path="/sectores" element={<Sectores />} />
               <Route path="/habitaciones" element={<Habitaciones />} />
               <Route path="/camas/:num_habitacion" element={<HabitacionDetails />} />
               <Route path="/internaciones" element={<Internaciones />} />
               <Route path="/internaciones/:id/seguimiento" element={<InternacionDetalle />} />
               <Route path="/guardias" element={<Guardias />} />
               <Route path="/camas_disponibles" element={<InformeDisponibilidad />} />
               <Route path="/auditoria_guardia" element={<Auditoria />} />
            </Routes>
         </main>
      </div>
   )
}

function App() {
   return (
      <Router>
         <Layout />
      </Router>
   )
}

export default App
