import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
   const navigate = useNavigate();

   return (
      <div className="max-w-4xl">
         <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-teal-700 hover:underline mb-6"
         >
            <ArrowLeft size={18} /> Volver
         </button>
      </div>
   );
}