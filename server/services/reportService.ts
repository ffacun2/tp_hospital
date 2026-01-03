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