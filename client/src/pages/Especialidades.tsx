import ListEspecialidades from "../components/especialidades/listEspecialidades";

export default function Especialidades() {

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Especialidades</h1>
          <p className="text-slate-600 mt-1">Gestión de Especialidades Médicas</p>
        </div>
      </div>
      <ListEspecialidades />
    </div>
  )
}
