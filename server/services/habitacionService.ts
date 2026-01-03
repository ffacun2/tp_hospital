import { pool } from "../config/db.ts";
import type { createHabitacionDTO, updateHabitacionDTO } from "../types/habitacion.type";


export const getAllHabitaciones = async () => {
   const query = `
        SELECT 
         h.num_habitacion, 
         h.piso, 
         h.orientacion, 
         JSON_BUILD_OBJECT(
            'id_sector', s.id_sector,
            'tipo', s.tipo
         ) AS sector
        FROM habitacion h
        JOIN sector s ON s.id_sector = h.id_sector
        ORDER BY h.num_habitacion
      `
   const { rows } = await pool.query(query);
   return rows;
}

export const getHabitacionById = async (id: string) => {
   const query = `
        SELECT
         h.num_habitacion, 
         h.piso, 
         h.orientacion, 
         JSON_BUILD_OBJECT(
            'id_sector', s.id_sector,
            'tipo', s.tipo
         ) AS sector
        FROM habitacion h
        JOIN sector s ON s.id_sector = h.id_sector
        WHERE h.num_habitacion = $1
      `;
   const { rows } = await pool.query(query, [id]);
   return rows[0];
}

export const createHabitacion = async (habitacionData: createHabitacionDTO) => {
   const query = `
      INSERT INTO habitacion (num_habitacion, piso, orientacion, id_sector)
      VALUES ($1, $2, $3, $4)
   `;
   const values = [
      habitacionData.num_habitacion,
      habitacionData.piso,
      habitacionData.orientacion,
      habitacionData.sector?.id_sector,
   ];
   const { rows } = await pool.query(query, values);
   return rows[0];
}

export const updateHabitacion = async (id: string, habitacionData: updateHabitacionDTO) => {
   const query = `
      UPDATE habitacion
      SET piso = $1, orientacion = $2, id_sector = $3
      WHERE num_habitacion = $4
   `;
   const values = [
      habitacionData.piso,
      habitacionData.orientacion,
      habitacionData.sector?.id_sector,
      id,
   ];
   const { rows } = await pool.query(query, values);
   return rows[0];
}

export const deleteHabitacion = async (id: string) => {
   const client = await pool.connect();
   try {
      await client.query("BEGIN");
      await client.query("DELETE FROM corresponde WHERE num_habitacion=$1", [
         id,
      ]);
      await client.query("DELETE FROM cama WHERE num_habitacion=$1", [
         id,
      ]);
      await client.query("DELETE FROM incluye WHERE num_habitacion=$1", [
         id,
      ]);
      await client.query("DELETE FROM habitacion WHERE num_habitacion=$1", [
         id,
      ]);
      await client.query("COMMIT");
      return { message: "Habitación eliminada exitosamente" };
   } catch (err: any) {
      await client.query("ROLLBACK");
      throw err;
   } finally {
      client.release();
   }
}