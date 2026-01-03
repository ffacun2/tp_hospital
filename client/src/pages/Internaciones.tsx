
import ListInternacion from "../components/internacion/listInternacion"

export default function Internaciones() {
   
   return (
      <div className="p-8">
         <div className="mb-6 flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-slate-800">Internaciones</h1>
               <p className="text-slate-600 mt-1">Gestión de internaciones hospitalarias</p>
            </div>            
         </div>

         <ListInternacion/>      
      
      </div>
   )
}
