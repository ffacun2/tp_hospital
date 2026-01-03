import { pool } from "../config/db.ts";


export const getAllEnums = async (typename: string) => {
   const query = `
      SELECT enumlabel
      FROM pg_enum
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
      WHERE pg_type.typname = $1
      ORDER BY enumsortorder
   `;
   const result = await pool.query(query, [typename.toLowerCase()]);
   return result.rows.map((row) => row.enumlabel);
}