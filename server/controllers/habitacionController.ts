import type { Request, Response } from 'express';
import * as habitacionService from "../services/habitacionService.ts";

export const getAllHabitaciones = async (req: Request, res: Response) => {
   try {
      const habitaciones = await habitacionService.getAllHabitaciones();
      res.json(habitaciones);
   } catch (error) {
      res.status(500).json({ error: "Error fetching habitaciones" });
   }
};

export const getHabitacionById = async (req: Request, res: Response) => {
   const { id } = req.params;
   try {
      const habitacion = await habitacionService.getHabitacionById(id);
      if (habitacion) {
         res.json(habitacion);
      } else {
         res.status(404).json({ error: "Habitación no encontrada" });
      }
   } catch (error) {
      res.status(500).json({ error: "Error fetching habitación" });
   }
};

export const createHabitacion = async (req: Request, res: Response) => {
   try {
      const newHabitacion = await habitacionService.createHabitacion(req.body);
      res.status(201).json(newHabitacion);
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const updateHabitacion = async (req: Request, res: Response) => {
   const { id } = req.params;
   try {
      const updatedHabitacion = await habitacionService.updateHabitacion(id, req.body);
      res.json(updatedHabitacion);
   }
   catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const deleteHabitacion = async (req: Request, res: Response) => {
   const { id } = req.params;
   try {
      const deleteResult = await habitacionService.deleteHabitacion(id);
      res.json(deleteResult);
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};
