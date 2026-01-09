import { Request, Response } from "express";
import * as roomService from "../services/roomService";



export const getAllRoomsByHabitacion = async (req: Request, res: Response) => {
   try {
      const num_habitacion = parseInt(req.params.num_habitacion);
      const result = await roomService.getAllRoomsByHabitacion(num_habitacion);
      res.json(result);
   } catch (err: any) {
      res.status(500).json({ error: err.message });
   }
}