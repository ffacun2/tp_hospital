import { pool } from "../config/db.ts";
import type { CreatePacienteDTO, UpdatePacienteDTO } from "../types/paciente.type.ts";

// GET all patients
export const getAllPacientes = async () => {
   const query = `SELECT dni, nombre, apellido, fecha_nac, sexo FROM paciente ORDER BY apellido, nombre`
   const { rows } = await pool.query(query);
   return rows;
};

export const getPacienteByDni = async (dni: string) => {
   const query = `SELECT dni, nombre, apellido, fecha_nac, sexo, domicilio, telefono FROM paciente WHERE dni = $1`;
   const result = await pool.query(query, [dni]);
   return result.rows[0];
}

export const createPaciente = async (pacienteData: CreatePacienteDTO) => {
   const query = `INSERT INTO paciente (dni, nombre, apellido, fecha_nac, sexo, domicilio, telefono) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
   const values = [
      pacienteData.dni,
      pacienteData.nombre,
      pacienteData.apellido,
      pacienteData.fecha_nac,
      pacienteData.sexo,
      pacienteData.domicilio || null,
      pacienteData.telefono || null
   ];
   const result = await pool.query(query, values);
   return result.rows[0];
};

export const updatePaciente = async (dni: string, pacienteData: UpdatePacienteDTO) => {
   const query = `UPDATE paciente SET nombre = $1, apellido = $2, fecha_nac = $3, sexo = $4, domicilio = $5, telefono = $6 WHERE dni = $7 RETURNING *`;
   const values = [
      pacienteData.nombre || null,
      pacienteData.apellido || null,
      pacienteData.fecha_nac || null,
      pacienteData.sexo || null,
      pacienteData.domicilio || null,
      pacienteData.telefono || null,
      dni
   ];
   const result = await pool.query(query, values);
   return result.rows[0];
};

export const deletePaciente = async (dni: string) => {
   const query = `DELETE FROM paciente WHERE dni = $1`;
   await pool.query(query, [dni]);
}