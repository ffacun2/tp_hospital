import { Sector } from "./sector.type.ts"

export interface Habitacion {
   num_habitacion: number
   piso: number
   orientacion: string
   sector?: Sector
}

export type createHabitacionDTO = Habitacion

export type updateHabitacionDTO = Partial<Habitacion>