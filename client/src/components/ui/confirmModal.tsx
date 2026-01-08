import { AlertTriangle, Info, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Props {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
   confirmText?: string;
   isLoading?: boolean;
   variant?: "danger" | "info" | "success";
   Icon?: LucideIcon;
}

export default function ConfirmModal({
   isOpen,
   onClose,
   onConfirm,
   title,
   message,
   confirmText = "Confirmar",
   isLoading = false,
   variant = "danger",
   Icon
}: Props) {
   if (!isOpen) return null;

   // Configuración de colores según la variante
   const configs = {
      danger: {
         bgIcon: "bg-red-100",
         iconColor: "text-red-600",
         btnConfirm: "bg-red-600 hover:bg-red-700 shadow-red-200",
         defaultIcon: AlertTriangle,
      },
      info: {
         bgIcon: "bg-blue-100",
         iconColor: "text-blue-600",
         btnConfirm: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
         defaultIcon: Info,
      },
      success: {
         bgIcon: "bg-emerald-100",
         iconColor: "text-emerald-600",
         btnConfirm: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
         defaultIcon: Info,
      }
   };

   const config = configs[variant];
   const DisplayIcon = Icon || config.defaultIcon;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         {/* Overlay */}
         <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
               <div className="flex items-start gap-4 mb-4">
                  <div className={`${config.bgIcon} ${config.iconColor} p-3 rounded-full shrink-0`}>
                     <DisplayIcon size={24} />
                  </div>
                  <div className="flex-1">
                     <h3 className="text-xl font-bold text-slate-800 leading-6">{title}</h3>
                     <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                     >
                        <X size={20} />
                     </button>
                  </div>
               </div>

               <p className="text-slate-600 mb-8 leading-relaxed">
                  {message}
               </p>

               <div className="flex gap-3 justify-end">
                  <button
                     onClick={onClose}
                     className="px-5 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                  >
                     Cancelar
                  </button>
                  <button
                     onClick={onConfirm}
                     disabled={isLoading}
                     className={`px-5 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 ${config.btnConfirm}`}
                  >
                     {isLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : confirmText}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}