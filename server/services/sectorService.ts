import { pool } from "../config/db.ts";
import type { createSectorDTO, updateSectorDTO } from "../types/sector.type.ts";


export const getAllSectors = async () => {
   const query = `
   SELECT id_sector, tipo
   FROM sector
   ORDER BY id_sector
   `;
   const { rows } = await pool.query(query);
   return rows;
}

export const getSectorById = async (id_sector: string) => {
   const query = `
   SELECT id_sector, tipo
   FROM sector
   WHERE id_sector = $1
   `;
   const result = await pool.query(query, [id_sector]);
   return result.rows[0];
}

export const createSector = async (sectorData: createSectorDTO) => {
   const query = `
   INSERT INTO sector (tipo)
   VALUES ($1)
   RETURNING id_sector, tipo
   `;
   const values = [sectorData.tipo];
   const { rows } = await pool.query(query, values);
   return rows[0];
}

export const updateSector = async (id_sector: string, sectorData: updateSectorDTO) => {
   console.log(sectorData)
   const query = `
   UPDATE sector
   SET tipo = $1
   WHERE id_sector = $2
   RETURNING id_sector, tipo
   `;
   const values = [sectorData.tipo, id_sector];
   const { rows } = await pool.query(query, values);
   return rows[0];
}

export const deleteSector = async (id_sector: string) => {
   const query = `
   DELETE FROM sector
   WHERE id_sector = $1
   `;
   await pool.query(query, [id_sector]);
}