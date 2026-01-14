import type { LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"

interface NavItemProps {
   to: string
   icon: LucideIcon
   label: string
   onClick?: () => void
}

export default function NavItem({ to, icon: Icon, label, onClick }: NavItemProps) {
   return (
      <NavLink
         to={to}
         onClick={onClick}
         className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
        ${isActive
               ? "bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
               : "text-slate-600 hover:bg-slate-100"
            }
      `}
      >
         <Icon className="w-5 h-5" />
         <span>{label}</span>
      </NavLink>
   )
}