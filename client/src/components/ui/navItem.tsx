import { Link, useLocation } from "react-router-dom";

export default function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
   const location = useLocation()
   const isActive = location.pathname === to
 
   return (
     <Link
       to={to}
       className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
         isActive
           ? "bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
           : "text-slate-600 hover:bg-slate-100"
       }`}
     >
       <Icon className="w-5 h-5" />
       <span className="font-medium">{label}</span>
     </Link>
   )
 }