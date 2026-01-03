import { pool } from "../config/db.ts";
import type { createInternacionDTO, updateInternacionDTO } from "../types/internacion.type";


export const getAllInternaciones = async () => {
   const query = `
   SELECT 
      i.id_internacion,
      i.fecha_inicio,
      i.fecha_fin,
      -- Construimos el objeto médico
      JSON_BUILD_OBJECT(
      'matricula', m.matricula,
      'nombre', m.nombre,
      'apellido', m.apellido
      ) AS medico,
      -- Construimos el objeto paciente
      JSON_BUILD_OBJECT(
      'dni', p.dni,
      'nombre', p.nombre,
      'apellido', p.apellido
      ) AS paciente
   FROM internacion i
   JOIN medico m ON m.matricula = i.matricula
   JOIN paciente p ON p.dni = i.dni
   ORDER BY i.id_internacion
   `
   const { rows } = await pool.query(query);
   return rows;
}

export const getInternacionById = async (id: number) => {
   const query = `
   SELECT
      i.id_internacion,
      i.fecha_inicio,
      i.fecha_fin,
      -- Construimos el objeto médico
      JSON_BUILD_OBJECT(
        'matricula', m.matricula,
        'nombre', m.nombre,
        'apellido', m.apellido
      ) AS medico,
      -- Construimos el objeto paciente
      JSON_BUILD_OBJECT(
        'dni', p.dni,
        'nombre', p.nombre,
        'apellido', p.apellido
      ) AS paciente
   FROM internacion i
   JOIN medico m ON m.matricula = i.matricula
   JOIN paciente p ON p.dni = i.dni
   WHERE i.id_internacion = $1
   `
   const { rows } = await pool.query(query, [id]);
   return rows[0];
}

export const createInternacion = async (internacionData: createInternacionDTO) => {
   const query = `
   INSERT INTO internacion 
   (fecha_inicio, fecha_fin, matricula, dni)
   VALUES ($1, $2, $3, $4)
   RETURNING *;
   `
   const values = [
      internacionData.fecha_inicio,
      null,
      internacionData.medico.matricula,
      internacionData.paciente.dni,
   ];
   const { rows } = await pool.query(query, values);
   return rows[0];
}

export const updateInternacion = async (id: number, internacionData: updateInternacionDTO) => {
   const query = `
   UPDATE internacion
   SET 
      fecha_inicio = COALESCE($1, fecha_inicio),
      fecha_fin = COALESCE($2, fecha_fin)
   WHERE id_internacion = $3
   RETURNING *;
   `
   const values = [
      internacionData.fecha_inicio,
      internacionData.fecha_fin,
      id,
   ];
   const { rows } = await pool.query(query, values);
   return rows[0];
}

export const deleteInternacion = async (id: number) => {
   const client = await pool.connect();
   try {
      await client.query("BEGIN");
      await client.query(
         "DELETE FROM comentario_recorrido WHERE id_internacion=$1",
         [id]
      );
      await client.query("DELETE FROM corresponde WHERE id_internacion=$1", [id]);
      await client.query("DELETE FROM incluye WHERE id_internacion=$1", [id]);
      await client.query("DELETE FROM internacion WHERE id_internacion=$1", [id]);
      await client.query("COMMIT");
      return { message: "Internación eliminada exitosamente" };
   } catch (err: any) {
      await client.query("ROLLBACK");
      throw err;
   } finally {
      client.release();
   }
}