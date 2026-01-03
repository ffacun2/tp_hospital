import { pool } from "../config/db.ts";


export const getAllEspecialidades = async () => {
   const query = `
      SELECT id_especialidad, nombre
      FROM especialidad
      ORDER BY id_especialidad
   `;
   const result = await pool.query(query);
   return result.rows;
}

export const getEspecialidadById = async (id: number) => {
   const query = `
      SELECT id_especialidad, nombre
      FROM especialidad
      WHERE id_especialidad = $1
   `;
   const result = await pool.query(query, [id]);
   return result.rows[0];
}

export const createEspecialidad = async (nombre: string) => {
   const query = `
      INSERT INTO especialidad (nombre)
      VALUES ($1)
      RETURNING id_especialidad, nombre
   `;
   const result = await pool.query(query, [nombre]);
   return result.rows[0];
}

export const updateEspecialidad = async (id: number, nombre: string) => {
   const query = `
      UPDATE especialidad
      SET nombre = $2
      WHERE id_especialidad = $1
      RETURNING id_especialidad, nombre
   `;
   const result = await pool.query(query, [id, nombre]);
   return result.rows[0];
}

export const deleteEspecialidad = async (id: number) => {
   const query = `
      DELETE FROM especialidad
      WHERE id_especialidad = $1
   `;
   await pool.query(query, [id]);
}