export interface Paciente {
  dni: number;
  nombre: string;
  apellido: string;
  fecha_nac: string;
  sexo: string;
  domicilio?: string;
  telefono?: string;
}

export type CreatePacienteDTO = Paciente;

export interface UpdatePacienteDTO extends Partial<Omit<Paciente, 'dni'>> {}