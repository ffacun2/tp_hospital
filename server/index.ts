import express from "express";
import type { Request, Response } from "express";
import { pool } from "./config/db.ts";
import cors from "cors";
import { loadEnvFile } from "node:process";
import sectorRoutes from "./routes/sectorRoutes.ts";
import pacienteRoutes from "./routes/pacienteRoutes.ts";
import medicoRoutes from "./routes/medicoRoutes.ts";
import habitacionRoutes from "./routes/habitacionRoutes.ts";
import internacionRoutes from "./routes/internacionRoutes.ts";
import enumRoutes from "./routes/enumRoutes.ts";
import reportRoutes from "./routes/reportRoutes.ts";
import especialidadRoutes from "./routes/especialidadRoutes.ts";
import roomRoutes from "./routes/bedRoutes.ts";

loadEnvFile("./.env");

const app = express();

const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Start server
app.listen(PORT, () => {
   console.log(`🏥 Servidor Express corriendo en http://localhost:${PORT}`);
   console.log(`📡 API disponible en http://localhost:${PORT}`);
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
   console.error(err.stack);
   res.status(500).json({ error: "Algo salió mal en el servidor" });
});


// ==================== PACIENTES ====================

app.use('/pacientes', pacienteRoutes)

// ==================== MEDICOS ====================

app.use('/medicos', medicoRoutes)

// ==================== ESPECIALIDADES ====================

app.use('/especialidades', especialidadRoutes)

// ==================== SECTORES ====================

app.use('/sectores', sectorRoutes)

// ==================== HABITACIONES ====================

app.use('/habitaciones', habitacionRoutes)

// ==================== INTERNACIONES ====================

app.use('/internaciones', internacionRoutes)

// ==================== ENUMS ====================

app.use('/config/enums', enumRoutes);

// ==================== REPORTES ====================

app.use('/reportes', reportRoutes);

// ==================== CAMAS ====================

app.use('/camas', roomRoutes)

// ==================== GUARDIAS ====================

// GET all shifts
app.get("/guardias", async (_req: Request, res: Response) => {
   try {
      const result = await pool.query(`
        SELECT 
          g.id_guardia,
          g.t_guardia,
          g.fecha_inicio,
          g.fecha_fin,
          e.nombre AS especialidad,
          e.id_especialidad
        FROM guardia g
        JOIN especialidad e ON e.id_especialidad = g.id_especialidad
        ORDER BY g.fecha_inicio DESC
      `);
      res.json(result.rows);
   } catch (err: any) {
      res.status(500).json({ error: err.message });
   }
});

// GET single shift
app.get("/guardias/:id", async (req: Request, res: Response) => {
   const id = Number(req.params.id);
   try {
      const result = await pool.query(
         `SELECT id_guardia, t_guardia, fecha_inicio, fecha_fin, id_especialidad 
         FROM guardia WHERE id_guardia=$1`,
         [id]
      );
      if (result.rowCount === 0) {
         return res.status(404).json({ error: "Guardia no encontrada" });
      }
      res.json(result.rows[0]);
   } catch (err: any) {
      res.status(500).json({ error: err.message });
   }
});

// POST create shift
app.post("/guardias", async (req: Request, res: Response) => {
   const { t_guardia, fecha_inicio, fecha_fin, id_especialidad } = req.body;
   try {
      await pool.query(
         "INSERT INTO guardia(t_guardia, fecha_inicio, fecha_fin, id_especialidad) VALUES ($1, $2, $3, $4)",
         [t_guardia, fecha_inicio, fecha_fin, Number(id_especialidad)]
      );
      res.status(201).json({ message: "Guardia creada exitosamente" });
   } catch (err: any) {
      res.status(400).json({ error: err.message });
   }
});

// PUT update shift
app.put("/guardias/:id", async (req: Request, res: Response) => {
   const id = Number(req.params.id);
   const { t_guardia, fecha_inicio, fecha_fin, id_especialidad } = req.body;
   try {
      await pool.query(
         "UPDATE guardia SET t_guardia=$1, fecha_inicio=$2, fecha_fin=$3, id_especialidad=$4 WHERE id_guardia=$5",
         [t_guardia, fecha_inicio, fecha_fin, Number(id_especialidad), id]
      );
      res.json({ message: "Guardia actualizada exitosamente" });
   } catch (err: any) {
      res.status(400).json({ error: err.message });
   }
});

// DELETE shift
app.delete("/guardias/:id", async (req: Request, res: Response) => {
   const id = Number(req.params.id);
   const client = await pool.connect();
   try {
      await client.query("BEGIN");
      await client.query("DELETE FROM asignacion WHERE id_guardia=$1", [id]);
      await client.query("DELETE FROM guardia WHERE id_guardia=$1", [id]);
      await client.query("COMMIT");
      res.json({ message: "Guardia eliminada exitosamente" });
   } catch (err: any) {
      await client.query("ROLLBACK");
      res.status(400).json({ error: err.message });
   } finally {
      client.release();
   }
});




