export interface Guardia {
    nro_guardia: number
    f_inicio: string
    f_fin: string
    matricula: number
    cod_sector: number
    medico_nombre?: string
    sector_nombre?: string
  }
  
  export interface Medico {
    matricula: number
    nombre: string
    apellido: string
  }
  
  export interface Sector {
    cod_sector: number
    nombre: string
  }

  export interface Habitacion {
    nro_habitacion: number
    cod_sector: number
    sector_nombre?: string
  }
  
  export interface Sector {
    cod_sector: number
    nombre: string
  }

  export interface Internacion {
    nro_internacion: number
    f_ingreso: string
    f_alta: string | null
    nro_habitacion: number
    nro_historial_clinico: number
    observaciones: string
    paciente_nombre?: string
  }
  
  export interface Paciente {
    nro_historial_clinico: number
    nombre: string
    apellido: string
  }
  
  export interface Habitacion {
    nro_habitacion: number
  }

  export interface Medico {
    matricula: number
    nombre: string
    apellido: string
    especialidad: string
    domicilio: string
    telefono: string
  }

  export interface Paciente {
    nro_historial_clinico: number
    nombre: string
    apellido: string
    dni: number
    f_nac: string
    domicilio: string
    telefono: string
  }

  export interface Sector {
    cod_sector: number
    nombre: string
  }