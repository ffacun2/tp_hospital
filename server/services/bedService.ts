import { pool } from "../config/db.ts";
import type { NewCama } from "../types/cama.type.ts";

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

export const createBed = async (cama: NewCama) => {
   const numHabitacion = cama.habitacion?.num_habitacion;

   if (!numHabitacion) {
      throw new Error("El número de habitación es requerido en el service");
   }
   const query = `
      INSERT INTO cama (num_cama, estado, num_habitacion)
      VALUES ($1, $2, $3)
   `
   const values = [cama.num_cama, cama.estado, numHabitacion]
   await pool.query(query, values)
}

export const deleteBed = async (num_cama: number) => {
   const query = `
      DELETE FROM cama
      WHERE num_cama = $1
   `
   const values = [num_cama]
   await pool.query(query, values)
}
