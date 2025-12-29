import { Users, UserCog, Building, DoorOpen, Activity, Shield } from "lucide-react"
import { Link } from "react-router-dom"

const modules = [
  {
    title: "Pacientes",
    icon: Users,
    description: "Gestionar datos de pacientes",
    link: "/pacientes",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Médicos",
    icon: UserCog,
    description: "Administrar médicos del hospital",
    link: "/medicos",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    title: "Sectores",
    icon: Building,
    description: "Organizar sectores hospitalarios",
    link: "/sectores",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Habitaciones",
    icon: DoorOpen,
    description: "Control de habitaciones",
    link: "/habitaciones",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Internaciones",
    icon: Activity,
    description: "Registro de internaciones",
    link: "/internaciones",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Guardias",
    icon: Shield,
    description: "Planificación de guardias",
    link: "/guardias",
    gradient: "from-rose-500 to-pink-500",
  },
]

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Sistema de Gestión Hospitalaria</h1>
        <p className="text-slate-600">Bienvenido al panel de administración</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link
              key={module.title}
              to={module.link}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-transparent"
            >
              <div
                className={`w-14 h-14 bg-linear-to-br ${module.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{module.title}</h3>
              <p className="text-slate-600 text-sm">{module.description}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
