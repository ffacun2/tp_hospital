import { Especialidad } from "./especialidad.type.ts";

export interface Medico {
   matricula: number;
   dni: number;
   cuil_cuit: number;
   nombre: string;
   apellido: string;
   telefono: string;
   especialidades?: Especialidad[];
}

export type createMedicoDTO = Medico;

export type updateMedicoDTO = Partial<Omit<Medico, 'matricula' | 'dni' | 'cuil_cuit'>>;