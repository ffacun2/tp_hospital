import { Router } from "express";
import * as roomController from "../controllers/roomController";

const router = Router();

router.get("/:num_habitacion", roomController.getAllRoomsByHabitacion);


export default router;