import { Router } from "express";
import * as enumController from "../controllers/enumController.ts";

const router = Router();

router.get('/:typename',enumController.getAllEnums);

export default router;