import { pool } from "../config/db.ts";


export const getReportCamasDisponiblesSector = async () => {
   const query = `
      SELECT *
      FROM sp_cantidad_camas_libres_por_sector()
   `;
   const result = await pool.query(query);
   return result.rows;
}


export const getReportCamasDisponiblesDetalle = async () => {
   const query = `
      SELECT *
      FROM sp_detalle_camas_disponibles()
   `;
   const result = await pool.query(query);
   return result.rows;
}

export const getAuditoriaGuardia = async () => {
   const query = `
      SELECT
         id_auditoria,
         accion,
         usuario,
         to_char(fecha_auditoria, 'DD/MM/YYYY HH24:MI:SS') as fecha,
         id_guardia,
         t_guardia,
         matricula,
         nombre_medico,
         apellido_medico,
         especialidad
      FROM aud_asignacion_guardia
      ORDER BY fecha_auditoria DESC
   `

   const result = await pool.query(query);
   return result.rows;
}