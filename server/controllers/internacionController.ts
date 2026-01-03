import type { Request, Response } from 'express';
import * as internacionService from "../services/internacionService.ts";


export const getAllInternacion = async (req: Request, res: Response) => {
   try {
      const internaciones = await internacionService.getAllInternaciones();
      res.json(internaciones);
   } catch (error) {
      res.status(500).json({ error: "Error fetching internaciones" });
   }
};

export const getInternacionById = async (req: Request, res: Response) => {
   const { id } = req.params;
   try {
      const internacion = await internacionService.getInternacionById(Number(id));
      if (internacion) {
         res.json(internacion);
      } else {
         res.status(404).json({ error: "Internación no encontrada" });
      }
   } catch (error) {
      res.status(500).json({ error: "Error fetching internacion" });
   }
};

export const createInternacion = async (req: Request, res: Response) => {
   try {
      const newInternacion = await internacionService.createInternacion(req.body);
      res.status(201).json(newInternacion);
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const updateInternacion = async (req: Request, res: Response) => {
   const { id } = req.params;
   try {
      const updateResult = await internacionService.updateInternacion(Number(id), req.body);
      res.json(updateResult);
   }
   catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const deleteInternacion = async (req: Request, res: Response) => {
   const { id } = req.params;
   try {
      const deleteResult = await internacionService.deleteInternacion(Number(id));
      res.json(deleteResult);
   }
   catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};