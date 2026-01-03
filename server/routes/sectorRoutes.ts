import { Router } from "express";
import * as sectorController from "../controllers/sectorController.ts";


const router = Router();

router.get("/", sectorController.getAllSectors);
router.get("/:id_sector", sectorController.getSectorById);
router.post("/", sectorController.createSector);
router.put("/:id_sector", sectorController.updateSector);
router.delete("/:id_sector", sectorController.deleteSector);

export default router;
