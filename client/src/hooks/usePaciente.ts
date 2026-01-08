import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pacientesAPI } from "../lib/api";
import type { Paciente } from "../types/types";

export const usePacientes = () => {
   const queryClient = useQueryClient();

   // 1. Query para obtener la lista completa
   const { data: pacientes = [], isLoading, isError } = useQuery<Paciente[]>({
      queryKey: ["pacientes"],
      queryFn: pacientesAPI.getAll,
   });

   // 2. Mutation para Crear
   const createMutation = useMutation({
      mutationFn: (nuevo: Omit<Paciente, 'id' & 'domicilio'>) => pacientesAPI.create(nuevo),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   // 3. Mutation para Editar
   const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Paciente, 'id' & 'domicilio'>> }) =>
         pacientesAPI.update(id, data),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   // 4. Mutation para Eliminar
   const deleteMutation = useMutation({
      mutationFn: (id: number) => pacientesAPI.delete(id),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   return {
      // Datos y estados
      pacientes,
      isLoading,
      isError,
      // Acciones de mutación
      createPaciente: createMutation.mutate,
      updatePaciente: updateMutation.mutate,
      deletePaciente: deleteMutation.mutate,
      // Estados de carga de acciones (opcional para deshabilitar botones)
      isSaving: createMutation.isPending || updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
   };
};