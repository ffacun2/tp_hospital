import { pool } from "../config/db";

export const getAllRoomsByHabitacion = async (num_habitacion: number) => {
   const query = `
      SELECT *
      FROM cama
      WHERE num_habitacion = $1
   `
   const values = [num_habitacion]
   const result = await pool.query(query, values)
   return result.rows
}