import { AlertCircle } from "lucide-react";


export default function Error({ message }: { message: string }) {
   return (
      <div className="flex items-center justify-center h-full">
         <div className="p-8 bg-white font-sans text-slate-900 flex items-center gap-4">
            <AlertCircle />
            <h1 className="text-2xl font-bold">{message}</h1>
         </div>
      </div>
   )
}