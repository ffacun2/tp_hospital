import Router from "express";
import * as reportController from "../controllers/reportController.ts";

const router = Router();

router.get('/camas-disponibles-sector', reportController.getReportCamasDisponiblesSector);
router.get('/camas-disponibles-detalle', reportController.getReportCamasDisponiblesDetalle);

export default router;