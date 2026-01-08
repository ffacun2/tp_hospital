import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Home, Users, UserCog, Building, DoorOpen, Activity, Shield, BriefcaseMedical, Bed, NotepadTextDashed } from "lucide-react"
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



function Layout() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Hospital</h1>
              <p className="text-xs text-slate-500">Sistema de Gestión</p>
            </div>
          </div>
        </div>

        <div>
            <hr className="border-slate-200" />
            <h4 className="block px-4 py-2 text-xs text-slate-400">General</h4>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem to="/" icon={Home} label="Dashboard" />
          <NavItem to="/pacientes" icon={Users} label="Pacientes" />
          <NavItem to="/medicos" icon={UserCog} label="Médicos" />
          <NavItem to="/especialidades" icon={BriefcaseMedical} label="Especialidades" />
          <NavItem to="/sectores" icon={Building} label="Sectores" />
          <NavItem to="/habitaciones" icon={DoorOpen} label="Habitaciones" />
          <NavItem to="/internaciones" icon={Activity} label="Internaciones" />
          <NavItem to="/guardias" icon={Shield} label="Guardias" />
        </nav>
        <div>
            <hr className="border-slate-200" />
            <h4 className="block px-4 py-2 text-xs text-slate-400">Reportes</h4>
        </div>
         <nav className="p-4 space-y-2 overflow-y-auto">
            <NavItem to="/camas_disponibles" icon={Bed} label="Camas Disponibles" />
            <NavItem to="/auditoria_guardia" icon={NotepadTextDashed} label="Auditoria Guardia (Admin)" />
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
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/medicos/:matricula" element={<MedicoDetalle />} />
          <Route path="/especialidades" element={<Especialidades />} />
          <Route path="/sectores" element={<Sectores />} />
          <Route path="/habitaciones" element={<Habitaciones />} />
          <Route path="/internaciones" element={<Internaciones />} />
          <Route path="/internaciones/:id/seguimiento" element={<InternacionDetalle />} />
          <Route path="/guardias" element={<Guardias />} />
          <Route path="/camas_disponibles" element={<InformeDisponibilidad />} />
          <Route path="/auditoria_guardia" element={<div className="p-6">Reportes - En construcción</div>} />

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
