import type { Request, Response } from 'express';
import * as reportService from "../services/reportService.ts";

export const getReportCamasDisponiblesSector = async (req: Request, res: Response) => {
   try {
      const result = await reportService.getReportCamasDisponiblesSector();
      res.json(result);
   } catch (err: any) {
      res.status(500).json({ error: err.message });
   }
}

export const getReportCamasDisponiblesDetalle = async (req: Request, res: Response) => {
   try {
      const result = await reportService.getReportCamasDisponiblesDetalle();
      res.json(result);
   } catch (err: any) {
      res.status(500).json({ error: err.message });
   }
}