
import ListSector from "../components/sector/listSector"


export default function Sectores() {
  

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sectores</h1>
          <p className="text-slate-600 mt-1">Gestión de sectores hospitalarios</p>
        </div>
      </div>
        <ListSector/>
    </div>
  )
}
