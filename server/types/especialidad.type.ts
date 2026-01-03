export interface Especialidad {
   id_especialidad: number
   nombre: string
   guardia? : boolean
   max_guardia? : number
}

export type CreateEspecialidadDTO = Omit<Especialidad, 'id_especialidad'>;

export type UpdateEspecialidadDTO = Partial<Omit<Especialidad, 'id_especialidad'>>;