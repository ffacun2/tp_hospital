
export default function LoadingSpinner({ message }: { message: string }) {

   return (
      <div className="flex items-center justify-center h-full">
         <div className="flex flex-col items-center gap-2">
            <div className="inline-block w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500">{message}</p>
         </div>
      </div>
   )
}