import { Router } from "express";
import * as pacienteController from "../controllers/pacienteController.ts";



const router = Router();

router.get("/", pacienteController.getPacientes);
router.get("/:dni", pacienteController.getPacienteByDni);
router.post("/", pacienteController.createPaciente);
router.put("/:dni", pacienteController.updatePaciente);
router.delete("/:dni", pacienteController.deletePaciente);

export default router;