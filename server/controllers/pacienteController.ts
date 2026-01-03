import type { Request, Response } from 'express';
import * as pacienteService from '../services/pacienteService.ts';

export const getPacientes = async (req: Request, res: Response) => {
   try {
      const pacientes = await pacienteService.getAllPacientes();
      res.json(pacientes);
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const getPacienteByDni = async (req: Request, res: Response) => {
   const { dni } = req.params;
   try {
      const paciente = await pacienteService.getPacienteByDni(dni);
      if (paciente) {
         res.json(paciente);
      } else {
         res.status(404).json({ error: "Paciente no encontrado" });
      }
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const createPaciente = async (req: Request, res: Response) => {
   try {
      const newPaciente = await pacienteService.createPaciente(req.body);
      res.status(201).json(newPaciente);
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const updatePaciente = async (req: Request, res: Response) => {
   const { dni } = req.params;
   try {
      const updatedPaciente = await pacienteService.updatePaciente(dni, req.body);
      if (updatedPaciente) {
         res.json(updatedPaciente);
      } else {
         res.status(404).json({ error: "Paciente no encontrado" });
      }
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};

export const deletePaciente = async (req: Request, res: Response) => {
   const { dni } = req.params;
   try {
      await pacienteService.deletePaciente(dni);
      res.status(204).send();
   } catch (error: any) {
      res.status(500).json({ error: error.message });
   }
};