import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicosAPI } from "../lib/api";
import type { Medico } from "../types/types";

export const useMedicos = () => {
   const queryClient = useQueryClient();

   // 1. Query para obtener la lista completa
   const { data: medicos = [], isLoading, isError } = useQuery<Medico[]>({
      queryKey: ["medicos"],
      queryFn: medicosAPI.getAllInfo,
   });

   // 2. Mutation para Crear
   const createMutation = useMutation({
      mutationFn: (nuevo: Omit<Medico, 'id' & 'domicilio'>) => medicosAPI.create(nuevo),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["medicos"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   // 3. Mutation para Editar
   const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Medico, 'id' & 'domicilio'>> }) =>
         medicosAPI.update(id, data),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["medicos"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   // 4. Mutation para Eliminar
   const deleteMutation = useMutation({
      mutationFn: (id: number) => medicosAPI.delete(id),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["medicos"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   return {
      // Datos y estados
      medicos,
      isLoading,
      isError,
      // Acciones de mutación
      createMedico: createMutation.mutate,
      updateMedico: updateMutation.mutate,
      deleteMedico: deleteMutation.mutate,
      // Estados de carga de acciones (opcional para deshabilitar botones)
      isSaving: createMutation.isPending || updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
   };
};