export interface Guardia {
    nro_guardia: number
    f_inicio: string
    f_fin: string
    matricula: number
    id_sector: number
    medico_nombre?: string
    sector_nombre?: string
  }
  
  export interface Medico {
    matricula: number
    nombre: string
    apellido: string
  }

  export interface Habitacion {
    num_habitacion: number
    piso: number
    id_sector: number
    sector_nombre?: string
  }
  

  export interface Internacion {
    nro_internacion: number
    f_ingreso: string
    f_alta: string | null
    nro_habitacion: number
    dni: number
    observaciones: string
    paciente_nombre?: string
  }
  
  export interface Paciente {
    dni: number
    nombre: string
    apellido: string
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