import { Router } from "express";
import * as bedController from "../controllers/bedController.ts";

const router = Router();

router.get("/:num_habitacion", bedController.getAllRoomsByHabitacion);
router.post("/", bedController.createBed);
router.delete("/:num_cama", bedController.deleteBed);


export default router;