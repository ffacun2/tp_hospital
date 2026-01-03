import { Router } from "express";
import * as medicoController from "../controllers/medicoController.ts";


const router = Router();

router.get("/info", medicoController.getAllMedicosInfo);
router.get("/", medicoController.getAllMedicos);
router.get("/:matricula", medicoController.getMedicoByMatricula);
router.post("/", medicoController.createMedico);
router.put("/:matricula", medicoController.updateMedico);
router.delete("/:matricula", medicoController.deleteMedico);

export default router;