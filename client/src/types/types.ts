export interface Guardia {
   nro_guardia: number
   f_inicio: string
   f_fin: string
   matricula: number
   id_sector: number
   medico_nombre?: string
   sector_nombre?: string
}

export interface Cama {
   id_cama: number
   nro_cama: number
   estado: string
   habitacion: Habitacion
}

export interface Habitacion {
   num_habitacion: number
   piso: number
   orientacion: string
   sector?: Sector
}


export interface Internacion {
   id_internacion: number
   fecha_inicio: string
   fecha_fin: string | null
   medico: Medico
   paciente: Paciente
   cama: Cama
   comentarios_recorrido?: ComentarioRecorrido[]
}

export interface Medico {
   matricula: number
   dni: number
   cuil_cuit: number
   nombre: string
   apellido: string
   especialidades?: Especialidad[]
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
   guardia?: boolean
   max_guardia?: number
}

export interface ReporteCamas {
   sector: string
   cantidad_disponible: number
}

export interface ReporteCamasDetalle {
   nombre_sector: string
   piso: number
   num_habitacion: string
   num_cama: string
   orientacion: string
}

export interface ComentarioRecorrido {
   nro_comentario: number
   texto: string
   internacion: Internacion
   fecha: string
}