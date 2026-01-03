import { Router } from "express";
import * as especialidadController from "../controllers/especialidadController.ts";


const routes = Router();

routes.get("/", especialidadController.getAllEspecialidades);
routes.get("/:id", especialidadController.getEspecialidadById);
routes.post("/", especialidadController.createEspecialidad);
routes.put("/:id", especialidadController.updateEspecialidad);
routes.delete("/:id", especialidadController.deleteEspecialidad);

export default routes;