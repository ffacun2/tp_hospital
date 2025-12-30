
import ListMedic from "../components/medico/listMedico"


export default function Medicos() {
  
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Médicos</h1>
          <p className="text-slate-600 mt-1">Gestión de médicos del hospital</p>
        </div>
        
      </div>

      <ListMedic/>
      
    </div>
  )
}
