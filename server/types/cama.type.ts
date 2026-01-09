import type { Habitacion } from "./habitacion.type.ts"

export interface Cama {
   id_cama: number
   num_cama: number
   estado: string
   habitacion: Partial<Habitacion>
}

export type NewCama = Partial<Cama>