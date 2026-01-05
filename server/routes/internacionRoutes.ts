import { Router } from "express";
import * as internacionController from "../controllers/internacionController.ts";


const router = Router();

router.get("/", internacionController.getAllInternacion);
router.get("/:id", internacionController.getInternacionById);
router.post("/", internacionController.createInternacion);
router.put("/:id", internacionController.updateInternacion);
router.delete("/:id", internacionController.deleteInternacion);
router.get("/:id/seguimiento", internacionController.detalleInternacion);

export default router;