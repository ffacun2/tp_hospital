import { pool } from "../config/db.ts";
import type {
   createInternacionDTO,
   updateInternacionDTO,
} from "../types/internacion.type";

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
   `;
   const { rows } = await pool.query(query);
   return rows;
};

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
   `;
   const { rows } = await pool.query(query, [id]);
   return rows[0];
};

export const createInternacion = async (
   internacionData: createInternacionDTO
) => {
   const query = `
   INSERT INTO internacion 
   (fecha_inicio, fecha_fin, matricula, dni)
   VALUES ($1, $2, $3, $4)
   RETURNING *;
   `;
   const values = [
      internacionData.fecha_inicio,
      null,
      internacionData.medico.matricula,
      internacionData.paciente.dni,
   ];
   const { rows } = await pool.query(query, values);
   return rows[0];
};

export const updateInternacion = async (
   id: number,
   internacionData: updateInternacionDTO
) => {
   const query = `
   UPDATE internacion
   SET 
      fecha_inicio = COALESCE($1, fecha_inicio),
      fecha_fin = COALESCE($2, fecha_fin)
   WHERE id_internacion = $3
   RETURNING *;
   `;
   const values = [internacionData.fecha_inicio, internacionData.fecha_fin, id];
   const { rows } = await pool.query(query, values);
   return rows[0];
};

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
};

export const seguimientoInternacion = async (id: number) => {
   const query = `
      SELECT *
      FROM sp_comentarios_internacion($1)
   `;
   const { rows } = await pool.query(query, [id]);
   return rows;
};

export const detalleInternacion = async (id: number) => {
   const query = `
   SELECT 
   i.id_internacion,
   i.fecha_inicio,
   i.fecha_fin,
   -- Objeto Paciente
   JSON_BUILD_OBJECT(
       'dni', p.dni,
       'nombre', p.nombre,
       'apellido', p.apellido,
       'sexo', p.sexo,
       'fecha_nac', p.fecha_nac
   ) AS paciente,
   -- Objeto Medico Responsable
   JSON_BUILD_OBJECT(
       'matricula', m.matricula,
       'nombre', m.nombre,
       'apellido', m.apellido
   ) AS medico,
   -- Objeto de la Cama Actual (o última asignada)
   (SELECT JSON_BUILD_OBJECT(
       'id_cama', c.num_cama,
       'nro_cama', c.num_cama,
       'habitacion', JSON_BUILD_OBJECT(
           'num_habitacion', h.num_habitacion,
           'piso', h.piso,
           'orientacion', h.orientacion,
           'sector', JSON_BUILD_OBJECT (
               'id_sector', s.id_sector,
               'tipo', s.tipo
           )
       )
   )
   FROM CORRESPONDE cor
   JOIN CAMA c ON cor.num_cama = c.num_cama AND cor.num_habitacion = c.num_habitacion
   JOIN HABITACION h ON c.num_habitacion = h.num_habitacion
   JOIN SECTOR s ON h.id_sector = s.id_sector
   WHERE cor.id_internacion = i.id_internacion
   ORDER BY cor.fecha DESC, cor.hora DESC
   LIMIT 1) AS cama,
   -- Array de Comentarios de Recorrido
   COALESCE(
       (SELECT JSON_AGG(
           JSON_BUILD_OBJECT(
               'nro_comentario', cr.nro_comentario,
               'texto', cr.texto,
               'fecha', r.fecha
           ) ORDER BY nro_comentario 
       )
       FROM COMENTARIO_RECORRIDO cr
       JOIN RECORRIDO r ON cr.id_recorrido = r.id_recorrido
       WHERE cr.id_internacion = i.id_internacion), 
       '[]'
   ) AS comentarios_recorrido
FROM INTERNACION i
JOIN PACIENTE p ON i.dni = p.dni
JOIN MEDICO m ON i.matricula = m.matricula
WHERE i.id_internacion = $1;
   `;
   const { rows } = await pool.query(query, [id])
   return rows[0];
};


export const getInternacionesByMedico = async (matricula: number) => {
   const query = `
   SELECT 
   i.id_internacion,
   i.fecha_inicio,
   i.fecha_fin,
   -- Objeto Paciente
   JSON_BUILD_OBJECT(
       'dni', p.dni,
       'nombre', p.nombre,
       'apellido', p.apellido
   ) AS paciente,
   -- Objeto de la Cama Actual (o última asignada)
   (SELECT JSON_BUILD_OBJECT(
       'id_cama', c.num_cama,
       'nro_cama', c.num_cama,
       'habitacion', JSON_BUILD_OBJECT(
           'num_habitacion', h.num_habitacion,
           'piso', h.piso,
           'orientacion', h.orientacion,
           'sector', JSON_BUILD_OBJECT (
               'id_sector', s.id_sector,
               'tipo', s.tipo
           )
       )
   )
   FROM CORRESPONDE cor
   JOIN CAMA c ON cor.num_cama = c.num_cama AND cor.num_habitacion = c.num_habitacion
   JOIN HABITACION h ON c.num_habitacion = h.num_habitacion
   JOIN SECTOR s ON h.id_sector = s.id_sector
   WHERE cor.id_internacion = i.id_internacion
   ORDER BY cor.fecha DESC, cor.hora DESC
   LIMIT 1) AS cama
   FROM internacion i
   JOIN paciente p ON i.dni = p.dni
   WHERE matricula = $1
   ORDER BY id_internacion;
   `;
   const { rows } = await pool.query(query, [matricula]);
   return rows;
};


export const getInternacionesByDni = async (dni: number) => {
   const query = `
   SELECT 
      i.id_internacion,
      i.fecha_inicio,
      i.fecha_fin,
      -- Objeto Medico Responsable
      JSON_BUILD_OBJECT(
         'matricula', m.matricula,
         'nombre', m.nombre,
         'apellido', m.apellido
      ) AS medico,
         -- Objeto de la Cama Actual (o última asignada)
         (SELECT JSON_BUILD_OBJECT(
            'id_cama', c.num_cama,
            'nro_cama', c.num_cama,
            'habitacion', JSON_BUILD_OBJECT(
               'num_habitacion', h.num_habitacion,
               'piso', h.piso,
               'orientacion', h.orientacion,
               'sector', JSON_BUILD_OBJECT (
                     'id_sector', s.id_sector,
                     'tipo', s.tipo
                  )  
               )
            )
         FROM CORRESPONDE cor
         JOIN CAMA c ON cor.num_cama = c.num_cama AND cor.num_habitacion = c.num_habitacion
         JOIN HABITACION h ON c.num_habitacion = h.num_habitacion
         JOIN SECTOR s ON h.id_sector = s.id_sector
         WHERE cor.id_internacion = i.id_internacion
         ORDER BY cor.fecha DESC, cor.hora DESC
         LIMIT 1
         ) AS cama
   FROM INTERNACION i
   JOIN MEDICO m ON i.matricula = m.matricula
   WHERE i.dni = $1;
   `;
   const { rows } = await pool.query(query, [dni]);
   return rows;
};