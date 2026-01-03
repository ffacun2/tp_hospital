import type { Request, Response } from 'express';
import * as enumServices from "../services/enumService.ts";


export const getAllEnums = async (req: Request, res: Response) => {
   const { typename } = req.params;
   try {
      const enums = await enumServices.getAllEnums(typename);
      res.json(enums);
   } catch (err: any) {
      res.status(500).json({ error: err.message });
   }
}
