import ListPaciente from "../components/paciente/listPaciente"

export default function Pacientes() {

return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pacientes</h1>
          <p className="text-slate-600 mt-1">Gestión de pacientes del hospital</p>
        </div>
      </div>

      <ListPaciente/>      
        
    </div>
  )
}
