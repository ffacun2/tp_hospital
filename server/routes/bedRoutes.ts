import { Router } from "express";
import * as bedController from "../controllers/bedController.ts";

const router = Router();

router.get("/:num_habitacion", bedController.getAllRoomsByHabitacion);


export default router;