
import ListRooms from "../components/rooms/listRooms"


export default function Habitaciones() {

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Habitaciones</h1>
          <p className="text-slate-600 mt-1">Gestión de habitaciones del hospital</p>
        </div>
      </div>

      <ListRooms/>
    </div>
  )
}
