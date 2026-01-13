import { Medico } from "./medico.type.ts"
import { Paciente } from "./paciente.type.ts"
import { Cama } from "./cama.type.ts"

export interface Internacion {
   id_internacion: number
   fecha_inicio: string
   fecha_fin: string | null
   medico: Medico
   paciente: Paciente
   cama: Cama
}

export type createInternacionDTO = Omit<Internacion, "id_internacion" | "fecha_fin">

export type updateInternacionDTO = Partial<Omit<Internacion, "id_internacion" | "medico" | "paciente">>