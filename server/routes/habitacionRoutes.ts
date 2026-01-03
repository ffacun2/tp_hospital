import { Router } from "express";
import * as habitacionController from "../controllers/habitacionController.ts";

const router = Router();

router.get("/", habitacionController.getAllHabitaciones);
router.get("/:id", habitacionController.getHabitacionById);
router.post("/", habitacionController.createHabitacion);
router.put("/:id", habitacionController.updateHabitacion);
router.delete("/:id", habitacionController.deleteHabitacion);

export default router;