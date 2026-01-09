import type { Request, Response } from "express";
import * as roomService from "../services/bedService.ts";
import type { NewCama } from "../types/cama.type.ts";



export const getAllRoomsByHabitacion = async (req: Request, res: Response) => {
   try {
      const num_habitacion = parseInt(req.params.num_habitacion);
      const result = await roomService.getAllRoomsByHabitacion(num_habitacion);
      res.json(result);
   } catch (err: any) {
      res.status(500).json({ error: err.message });
   }
}

export const createBed = async (req: Request, res: Response) => {
   try {
      const { num_cama, estado, habitacion } = req.body;
      const newBedData: NewCama = {
         num_cama,
         estado,
         habitacion: {
            num_habitacion: Number(habitacion.num_habitacion)
         }
      };
      const result = await roomService.createBed(newBedData);
      res.json(result);
   } catch (err: any) {
      console.log(err)
      res.status(500).json({ error: err.message });
   }
}

export const deleteBed = async (req: Request, res: Response) => {
   try {
      const num_cama = parseInt(req.params.num_cama);
      const result = await roomService.deleteBed(num_cama);
      res.json(result);
   } catch (err: any) {
      res.status(500).json({ error: err.message });
   }
}
