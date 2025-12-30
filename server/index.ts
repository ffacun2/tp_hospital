import express from 'express';
import type { Request, Response } from 'express';
import { Pool } from 'pg'
import { loadEnvFile } from 'node:process';
import cors from "cors"

loadEnvFile('./.env');

const app = express();

const PORT = process.env.PORT;

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "hospital_bd",
  password: process.env.DB_PASSWORD || "postgres",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
})


// Test database connection
pool.connect((err, client, release) => {
    if (err) {
      console.error("Error connecting to database:", err)
    } else {
      console.log("Database connected successfully")
      release()
    }
  })
  
  // ==================== PACIENTES ====================
  
  // GET all patients
  app.get("/pacientes", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT dni, nombre, apellido, fecha_nac, sexo FROM paciente ORDER BY apellido, nombre",
      )
      res.json(result.rows)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // GET single patient
  app.get("/pacientes/:dni", async (req: Request, res: Response) => {
    const dni = Number(req.params.dni)
    try {
      const result = await pool.query("SELECT dni, nombre, apellido, fecha_nac, sexo FROM paciente WHERE dni=$1", [dni])
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Paciente no encontrado" })
      }
      res.json(result.rows[0])
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // POST create patient
  app.post("/pacientes", async (req: Request, res: Response) => {
    const { dni, nombre, apellido, fecha_nac, sexo } = req.body
    try {
      await pool.query("INSERT INTO paciente(dni, nombre, apellido, fecha_nac, sexo) VALUES ($1, $2, $3, $4, $5)", [
        Number(dni),
        nombre,
        apellido,
        fecha_nac,
        sexo,
      ])
      res.status(201).json({ message: "Paciente creado exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // PUT update patient
  app.put("/pacientes/:dni", async (req: Request, res: Response) => {
    const dni = Number(req.params.dni)
    const { nombre, apellido, f_nac, sexo } = req.body
    try {
      await pool.query("UPDATE paciente SET nombre=$1, apellido=$2, fecha_nac=$3, sexo=$4 WHERE dni=$5", [
        nombre,
        apellido,
        f_nac,
        sexo,
        dni,
      ])
      res.json({ message: "Paciente actualizado exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // DELETE patient
  app.delete("/pacientes/:dni", async (req: Request, res: Response) => {
    const dni = Number(req.params.dni)
    try {
      await pool.query("DELETE FROM paciente WHERE dni=$1", [dni])
      res.json({ message: "Paciente eliminado exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // ==================== MEDICOS ====================
  
  // GET all doctors
  app.get("/medicos", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(
        "SELECT matricula, dni, nombre, apellido, cuil_cuit, fecha_ingreso FROM medico ORDER BY apellido, nombre",
      )
      res.json(result.rows)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // GET single doctor
  app.get("/medicos/:matricula", async (req: Request, res: Response) => {
    const matricula = Number(req.params.matricula)
    try {
      const result = await pool.query(
        "SELECT matricula, dni, nombre, apellido, cuil_cuit, fecha_ingreso FROM medico WHERE matricula=$1",
        [matricula],
      )
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Médico no encontrado" })
      }
      res.json(result.rows[0])
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // POST create doctor
  app.post("/medicos", async (req: Request, res: Response) => {
    const { matricula, dni, nombre, apellido, cuil_cuit, fecha_ingreso } = req.body
    try {
      await pool.query(
        "INSERT INTO medico(matricula, dni, nombre, apellido, cuil_cuit, fecha_ingreso) VALUES ($1, $2, $3, $4, $5, $6)",
        [Number(matricula), Number(dni), nombre, apellido, cuil_cuit, new Date()],
      )
      res.status(201).json({ message: "Médico creado exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // PUT update doctor
  app.put("/medicos/:matricula", async (req: Request, res: Response) => {
    const matricula = Number(req.params.matricula)
    const { dni, nombre, apellido, cuil_cuit, fecha_ingreso } = req.body
    try {
      await pool.query(
        "UPDATE medico SET nombre=$1, apellido=$2 WHERE matricula=$3",
        [nombre, apellido, matricula],
      )
      res.json({ message: "Médico actualizado exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // DELETE doctor
  app.delete("/medicos/:matricula", async (req: Request, res: Response) => {
    const matricula = Number(req.params.matricula)
    try {
      await pool.query("DELETE FROM medico WHERE matricula=$1", [matricula])
      res.json({ message: "Médico eliminado exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // ==================== SECTORES ====================
  
  // GET all sectors
  app.get("/sectores", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query("SELECT id_sector, tipo FROM sector ORDER BY id_sector")
      res.json(result.rows)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // GET single sector
  app.get("/sectores/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
      const result = await pool.query("SELECT id_sector, tipo FROM sector WHERE id_sector=$1", [id])
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Sector no encontrado" })
      }
      res.json(result.rows[0])
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // POST create sector
  app.post("/sectores", async (req: Request, res: Response) => {
    const { tipo } = req.body
    try {
      await pool.query("INSERT INTO sector(tipo) VALUES($1)", [tipo])
      res.status(201).json({ message: "Sector creado exitosamente" })
    } catch (err: any) {
      console.log(err)
      res.status(400).json({ error: err.message })
    }
  })
  
  // PUT update sector
  app.put("/sectores/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { tipo } = req.body
    try {
      await pool.query("UPDATE sector SET tipo=$1 WHERE id_sector=$2", [tipo, id])
      res.json({ message: "Sector actualizado exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // DELETE sector
  app.delete("/sectores/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
      await pool.query("DELETE FROM sector WHERE id_sector=$1", [id])
      res.json({ message: "Sector eliminado exitosamente" })
    } catch (err: any) {
      console.log(err)
      res.status(400).json({ error: err.message })
    }
  })
  
  // ==================== HABITACIONES ====================
  
  // GET all rooms
  app.get("/habitaciones", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(`
        SELECT h.num_habitacion, h.piso, h.orientacion, h.id_sector, s.tipo AS sector
        FROM habitacion h
        JOIN sector s ON s.id_sector = h.id_sector
        ORDER BY h.num_habitacion
      `)
      res.json(result.rows)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // GET single room
  app.get("/habitaciones/:num", async (req: Request, res: Response) => {
    const num_habitacion = Number(req.params.num)
    try {
      const result = await pool.query(
        "SELECT num_habitacion, piso, orientacion, id_sector FROM habitacion WHERE num_habitacion=$1",
        [num_habitacion],
      )
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Habitación no encontrada" })
      }
      res.json(result.rows[0])
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // POST create room
  app.post("/habitaciones", async (req: Request, res: Response) => {
    const { num_habitacion, piso, orientacion, id_sector } = req.body
    try {
      await pool.query("INSERT INTO habitacion(num_habitacion, piso, orientacion, id_sector) VALUES ($1, $2, $3, $4)", [
        Number(num_habitacion),
        Number(piso),
        orientacion,
        Number(id_sector),
      ])
      res.status(201).json({ message: "Habitación creada exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // PUT update room
  app.put("/habitaciones/:num", async (req: Request, res: Response) => {
    const num_habitacion = Number(req.params.num)
    const { piso, orientacion, id_sector } = req.body
    try {
      await pool.query("UPDATE habitacion SET piso=$1, orientacion=$2, id_sector=$3 WHERE num_habitacion=$4", [
        Number(piso),
        orientacion,
        Number(id_sector),
        num_habitacion,
      ])
      res.json({ message: "Habitación actualizada exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // DELETE room
  app.delete("/habitaciones/:num", async (req: Request, res: Response) => {
    const num_habitacion = Number(req.params.num)
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      await client.query("DELETE FROM corresponde WHERE num_habitacion=$1", [num_habitacion])
      await client.query("DELETE FROM cama WHERE num_habitacion=$1", [num_habitacion])
      await client.query("DELETE FROM incluye WHERE num_habitacion=$1", [num_habitacion])
      await client.query("DELETE FROM habitacion WHERE num_habitacion=$1", [num_habitacion])
      await client.query("COMMIT")
      res.json({ message: "Habitación eliminada exitosamente" })
    } catch (err: any) {
      await client.query("ROLLBACK")
      res.status(400).json({ error: err.message })
    } finally {
      client.release()
    }
  })
  
  // ==================== INTERNACIONES ====================
  
  // GET all internments
  app.get("/internaciones", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(`
        SELECT 
          i.id_internacion,
          i.fecha_inicio,
          i.fecha_fin,
          i.matricula,
          i.dni,
          m.apellido AS apellido_medico,
          m.nombre AS nombre_medico,
          p.apellido AS apellido_paciente,
          p.nombre AS nombre_paciente
        FROM internacion i
        JOIN medico m ON m.matricula = i.matricula
        JOIN paciente p ON p.dni = i.dni
        ORDER BY i.id_internacion
      `)
      res.json(result.rows)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // GET single internment
  app.get("/internaciones/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
      const result = await pool.query(
        `SELECT id_internacion, fecha_inicio, fecha_fin, matricula, dni 
         FROM internacion WHERE id_internacion=$1`,
        [id],
      )
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Internación no encontrada" })
      }
      res.json(result.rows[0])
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // POST create internment
  app.post("/internaciones", async (req: Request, res: Response) => {
    const { fecha_inicio, fecha_fin, matricula, dni } = req.body
    try {
      const fechaFinValue = fecha_fin && fecha_fin !== "" ? fecha_fin : null
      await pool.query("INSERT INTO internacion(fecha_inicio, fecha_fin, matricula, dni) VALUES ($1, $2, $3, $4)", [
        fecha_inicio,
        fechaFinValue,
        Number(matricula),
        Number(dni),
      ])
      res.status(201).json({ message: "Internación creada exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // PUT update internment
  app.put("/internaciones/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { fecha_inicio, fecha_fin, matricula, dni } = req.body
    try {
      const fechaFinValue = fecha_fin && fecha_fin !== "" ? fecha_fin : null
      await pool.query(
        "UPDATE internacion SET fecha_inicio=$1, fecha_fin=$2, matricula=$3, dni=$4 WHERE id_internacion=$5",
        [fecha_inicio, fechaFinValue, Number(matricula), Number(dni), id],
      )
      res.json({ message: "Internación actualizada exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // DELETE internment
  app.delete("/internaciones/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      await client.query("DELETE FROM comentario_recorrido WHERE id_internacion=$1", [id])
      await client.query("DELETE FROM corresponde WHERE id_internacion=$1", [id])
      await client.query("DELETE FROM incluye WHERE id_internacion=$1", [id])
      await client.query("DELETE FROM internacion WHERE id_internacion=$1", [id])
      await client.query("COMMIT")
      res.json({ message: "Internación eliminada exitosamente" })
    } catch (err: any) {
      await client.query("ROLLBACK")
      res.status(400).json({ error: err.message })
    } finally {
      client.release()
    }
  })
  
  // GET internment followup/comments
  app.get("/internaciones/:id/seguimiento", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
      const result = await pool.query("SELECT * FROM sp_comentarios_internacion($1)", [id])
      res.json(result.rows)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
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
      `)
      res.json(result.rows)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // GET single shift
  app.get("/guardias/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    try {
      const result = await pool.query(
        `SELECT id_guardia, t_guardia, fecha_inicio, fecha_fin, id_especialidad 
         FROM guardia WHERE id_guardia=$1`,
        [id],
      )
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Guardia no encontrada" })
      }
      res.json(result.rows[0])
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // POST create shift
  app.post("/guardias", async (req: Request, res: Response) => {
    const { t_guardia, fecha_inicio, fecha_fin, id_especialidad } = req.body
    try {
      await pool.query(
        "INSERT INTO guardia(t_guardia, fecha_inicio, fecha_fin, id_especialidad) VALUES ($1, $2, $3, $4)",
        [t_guardia, fecha_inicio, fecha_fin, Number(id_especialidad)],
      )
      res.status(201).json({ message: "Guardia creada exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // PUT update shift
  app.put("/guardias/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { t_guardia, fecha_inicio, fecha_fin, id_especialidad } = req.body
    try {
      await pool.query(
        "UPDATE guardia SET t_guardia=$1, fecha_inicio=$2, fecha_fin=$3, id_especialidad=$4 WHERE id_guardia=$5",
        [t_guardia, fecha_inicio, fecha_fin, Number(id_especialidad), id],
      )
      res.json({ message: "Guardia actualizada exitosamente" })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })
  
  // DELETE shift
  app.delete("/guardias/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      await client.query("DELETE FROM asignacion WHERE id_guardia=$1", [id])
      await client.query("DELETE FROM guardia WHERE id_guardia=$1", [id])
      await client.query("COMMIT")
      res.json({ message: "Guardia eliminada exitosamente" })
    } catch (err: any) {
      await client.query("ROLLBACK")
      res.status(400).json({ error: err.message })
    } finally {
      client.release()
    }
  })
  
  // GET specialty list for dropdowns
  app.get("/especialidades", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query("SELECT id_especialidad, nombre FROM especialidad ORDER BY nombre")
      res.json(result.rows)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // GET audit report
  app.get("/reportes/auditoria", async (_req: Request, res: Response) => {
    try {
      const result = await pool.query(`
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
      `)
      res.json(result.rows)
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })
  
  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error(err.stack)
    res.status(500).json({ error: "Algo salió mal en el servidor" })
  })
  
  // Start server
  app.listen(PORT, () => {
    console.log(`🏥 Servidor Express corriendo en http://localhost:${PORT}`)
    console.log(`📡 API disponible en http://localhost:${PORT}`)
  })
  
  // Enum tipo_sexo
app.get('/config/enums/:typename', async (req, res) => {
  const { typename } = req.params;
  try {
      const result = await pool.query(`
          SELECT enumlabel 
          FROM pg_enum 
          JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
          WHERE pg_type.typname = $1
          ORDER BY enumsortorder`,
          [typename.toLowerCase()] 
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ message: "Tipo de dato no encontrado" });
      }

      const labels = result.rows.map(r => r.enumlabel);
      res.json(labels);
  } catch (err: any) {
      res.status(500).json({ error: err.message });
  }
});