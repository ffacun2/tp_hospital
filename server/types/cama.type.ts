import { Habitacion } from "./habitacion.type.ts"

export interface Cama {
   id_cama: number
   nro_cama: number
   estado: string
   habitacion: Habitacion
}