export interface Guardia {
   nro_guardia: number
   f_inicio: string
   f_fin: string
   matricula: number
   id_sector: number
   medico_nombre?: string
   sector_nombre?: string
}


export interface Habitacion {
   num_habitacion: number
   piso: number
   orientacion: string
   id_sector: number
   sector?: string
}


export interface Internacion {
   id_internacion: number
   fecha_inicio: string
   fecha_fin: string | null
   dni: number
   matricula: number
}

export interface Medico {
   matricula: number
   dni: number
   cuil_cuit: number
   nombre: string
   apellido: string
   especialidad: string
   telefono: string
}

export interface Paciente {
   nombre: string
   apellido: string
   dni: number
   sexo: string
   fecha_nac: string
   domicilio: string
   telefono: string
}

export interface Sector {
   id_sector: number
   tipo: string
}

export interface Especialidad {
   id_especialidad: number
   nombre: string
}