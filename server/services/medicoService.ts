import { pool } from "../config/db.ts";
import type { createMedicoDTO, updateMedicoDTO } from "../types/medico.type";


export const getMedicosInfo = async () => {
   const query = `
         SELECT 
            m.matricula, 
            m.dni, 
            m.cuil_cuit, 
            m.nombre, 
            m.apellido, 
            m.telefono,
            COALESCE(
               JSON_AGG(
                  JSON_BUILD_OBJECT(
                     'id_especialidad', e.id_especialidad,
                     'nombre', e.nombre,
                     'guardia', ee.realiza_guardia,
                     'max_guardia', ee.max_guardia
                  )
               ) FILTER (WHERE e.id_especialidad IS NOT NULL), 
               '[]'
            ) AS especialidades
         FROM medico m
         LEFT JOIN especializado_en ee ON m.matricula = ee.matricula
         LEFT JOIN especialidad e ON ee.id_especialidad = e.id_especialidad
         GROUP BY m.matricula, m.dni, m.cuil_cuit, m.nombre, m.apellido, m.telefono
         ORDER BY m.apellido, m.nombre;
      `;
   const { rows } = await pool.query(query);
   return rows;
}

export const getAllMedicos = async () => {
   const query = `SELECT matricula, dni, cuil_cuit, nombre, apellido, telefono FROM medico ORDER BY apellido, nombre`;
   const { rows } = await pool.query(query);
   return rows;
}

export const getMedicoByMatricula = async (matricula: string) => {
   const query = `
      SELECT 
         m.matricula, 
         m.dni, 
         m.cuil_cuit, 
         m.nombre, 
         m.apellido, 
         m.telefono,
         COALESCE(
            JSON_AGG(
               JSON_BUILD_OBJECT(
                  'id_especialidad', e.id_especialidad,
                  'nombre', e.nombre,
                  'guardia', ee.realiza_guardia,
                  'max_guardia', ee.max_guardia
               )
            ) FILTER (WHERE e.id_especialidad IS NOT NULL), 
            '[]'
         ) AS especialidades
         FROM medico m
         LEFT JOIN especializado_en ee ON m.matricula = ee.matricula
         LEFT JOIN especialidad e ON ee.id_especialidad = e.id_especialidad
         WHERE m.matricula = $1
         GROUP BY m.matricula, m.dni, m.cuil_cuit, m.nombre, m.apellido, m.telefono
         ORDER BY m.apellido, m.nombre;
      `;
   const result = await pool.query(query, [matricula]);
   return result.rows[0];
}

export const createMedico = async (medicoData: createMedicoDTO) => {
   const client = await pool.connect();

   try {
      await client.query("BEGIN");

      // 1. Insertar el médico
      const medicoQuery = `
      INSERT INTO medico 
      (matricula, dni, nombre, apellido, cuil_cuit, telefono, fecha_ingreso)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
    `;
      const medicoValues = [
         medicoData.matricula,
         medicoData.dni,
         medicoData.nombre,
         medicoData.apellido,
         medicoData.cuil_cuit,
         medicoData.telefono,
      ]
      await client.query(medicoQuery, medicoValues);

      // 2. Insertar especialidades si existen
      if (medicoData.especialidades && medicoData.especialidades.length > 0) {
         const ids = medicoData.especialidades.map(e => e.id_especialidad);
         const guardias = medicoData.especialidades.map(e => e.guardia);
         const maxGuardias = medicoData.especialidades.map(e => e.max_guardia);

         const intermediateQuery = `
        INSERT INTO especializado_en 
        (matricula, id_especialidad, realiza_guardia, max_guardia)
        SELECT $1, * FROM UNNEST($2::int[], $3::boolean[], $4::int[])
      `;
         await client.query(intermediateQuery, [medicoData.matricula, ids, guardias, maxGuardias]);
      }

      await client.query("COMMIT");
      return { success: true };

   } catch (error) {
      await client.query("ROLLBACK");
      throw error; // Propagamos el error al controlador
   } finally {
      client.release();
   }
}

export const updateMedico = async (matricula: string, medicoData: updateMedicoDTO) => {
   const client = await pool.connect();

   try {
      await client.query("BEGIN");

      const medicoQuery = `
         UPDATE medico 
         SET nombre = $1, apellido = $2, telefono = $3
         WHERE matricula = $4
      `;
      const medicoValues = [
         medicoData.nombre || null,
         medicoData.apellido || null,
         medicoData.telefono || null,
         matricula,
      ];
      await client.query(medicoQuery, medicoValues);

      // 2. Eliminamos las especialidades viejas en la tabla intermedia
      await client.query("DELETE FROM especializado_en WHERE matricula = $1", [
         matricula,
      ]);

      // 3. Insertamos las nuevas especialidades seleccionadas
      if (medicoData.especialidades && medicoData.especialidades.length > 0) {
         const ids = medicoData.especialidades.map((e: any) => e.id_especialidad);
         const guardias = medicoData.especialidades.map((e: any) => e.guardia);
         const frecuencias = medicoData.especialidades.map((e: any) => e.max_guardia);

         const especialidadQuery = `
            INSERT INTO especializado_en 
            (matricula, id_especialidad, realiza_guardia, max_guardia)
            SELECT $1, * FROM UNNEST($2::int[], $3::boolean[], $4::int[])
         `;

         await client.query(especialidadQuery, [
            matricula,
            ids,
            guardias,
            frecuencias,
         ]);
      }

      await client.query("COMMIT"); // Si todo salió bien, guardamos
      return { message: "Médico actualizado correctamente" };
   } catch (error: any) {
      await client.query("ROLLBACK"); // Si algo falló, deshacemos todo
      throw error;
   } finally {
      client.release();
   }
}