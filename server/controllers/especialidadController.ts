import type { Request, Response } from 'express';
import * as especialidadServices from "../services/especialidadService.ts";


export const getAllEspecialidades = async (req: Request, res: Response) => {
   try {
      const especialidades = await especialidadServices.getAllEspecialidades();
      res.json(especialidades);
   } catch (err: any) {
      res.status(500).json({ error: "Error", message: err.message });
   }
}

export const getEspecialidadById = async (req: Request, res: Response) => {
   const id = Number(req.params.id);
   try {
      const especialidad = await especialidadServices.getEspecialidadById(id);
      if (especialidad) {
         res.json(especialidad);
      }
      else {
         res.status(404).json({ error: "Error", message: "Especialidad no encontrada" });
      }
   } catch (err: any) {
      res.status(500).json({ error: "Error", message: err.message });
   }
}

export const createEspecialidad = async (req: Request, res: Response) => {
   const { nombre } = req.body;
   try {
      const nuevaEspecialidad = await especialidadServices.createEspecialidad(nombre);
      res.status(201).json(nuevaEspecialidad);
   } catch (err: any) {
      res.status(500).json({ error: "Error", message: err.message });
   }
}

export const updateEspecialidad = async (req: Request, res: Response) => {
   const id = Number(req.params.id);
   const { nombre } = req.body;
   try {
      const especialidadActualizada = await especialidadServices.updateEspecialidad(id, nombre);
      if (especialidadActualizada) {
         res.json(especialidadActualizada);
      }
      else {
         res.status(404).json({ error: "Error", message: "Especialidad no encontrada" });
      }
   } catch (err: any) {
      res.status(500).json({ error: "Error", message: err.message });
   }
}

export const deleteEspecialidad = async (req: Request, res: Response) => {
   const id = Number(req.params.id);
   try {
      await especialidadServices.deleteEspecialidad(id);
      res.json({ message: "Especialidad eliminada exitosamente" });
   } catch (err: any) {
      res.status(500).json({ error: "Error", message: err.message });
   }
}