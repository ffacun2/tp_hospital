import type { Request, Response } from 'express';
import * as medicoService from "../services/medicoService.ts";



export const getAllMedicosInfo = async(req: Request, res:Response) => {
   try {
      const medicos = await medicoService.getMedicosInfo();
      res.json(medicos);
   } catch (error) {
      res.status(500).json({ error: "Error fetching medicos info" });
   }
}

export const getAllMedicos = async (req: Request, res: Response) => {
   try {
      const medicos = await medicoService.getAllMedicos();
      res.json(medicos);
   } catch (error) {
      res.status(500).json({ error: "Error fetching medicos" });
   } 
};

export const getMedicoByMatricula = async (req: Request, res: Response) => {
   const { matricula } = req.params;
   try {
      const medico = await medicoService.getMedicoByMatricula(matricula);
      if (medico) {
         res.json(medico);
      } else {
         res.status(404).json({ error: "Médico no encontrado" });
      }
   } catch (error) {
      res.status(500).json({ error: "Error fetching medico" });
   }
};

export const createMedico = async (req: Request, res: Response) => {
   try {
      const newMedico = await medicoService.createMedico(req.body);
      res.status(201).json(newMedico);
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const updateMedico = async (req: Request, res: Response) => {
   const { matricula } = req.params;
   try {
      const updateResult = await medicoService.updateMedico(matricula, req.body);
      res.json(updateResult);
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const deleteMedico = async (req: Request, res: Response) => {
   const { matricula } = req.params;
   try {
      // await medicoService.deleteMedico(matricula);
      res.status(204).send();
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};