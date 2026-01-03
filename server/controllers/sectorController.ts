import type { Request, Response } from 'express';
import * as sectorService from "../services/sectorService.ts";


export const getAllSectors = async (req: Request, res: Response) => {
   try {
      const sectors = await sectorService.getAllSectors();
      res.json(sectors);
   } catch (error) {
      res.status(500).json({ error: "Error fetching sectors" });
   }
};

export const getSectorById = async (req: Request, res: Response) => {
   try {
      const sector = await sectorService.getSectorById(req.params.id_sector);
      res.json(sector);
   } catch (error) {
      res.status(500).json({ error: "Error fetching sector" });
   }
};
export const createSector = async (req: Request, res: Response) => {
   try {
      const newSector = await sectorService.createSector(req.body);
      res.status(201).json(newSector);
   } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.message });
   }
};

export const updateSector = async (req: Request, res: Response) => {
   try {
      const updatedSector = await sectorService.updateSector(req.params.id_sector, req.body);
      res.json(updatedSector);
   } catch (error: any) {
      console.log(error)
      res.status(500).json({ error: error.message });
   }
};

export const deleteSector = async (req: Request, res: Response) => {
   try {
      await sectorService.deleteSector(req.params.id_sector);
      res.status(204).send();
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};