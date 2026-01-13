import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitacionesAPI } from "../lib/api";
import type { Habitacion } from "../types/types";

export const useHabitacion = () => {
   const queryClient = useQueryClient();

   // 1. Query para obtener la lista completa
   const { data: habitaciones = [], isLoading, isError } = useQuery<Habitacion[]>({
      queryKey: ["habitaciones"],
      queryFn: habitacionesAPI.getAll,
   });

   // 2. Mutation para Crear
   const createMutation = useMutation({
      mutationFn: (nuevo: Omit<Habitacion, 'id'>) => habitacionesAPI.create(nuevo),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["habitaciones"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   // 3. Mutation para Editar
   const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Habitacion, 'id'>> }) =>
         habitacionesAPI.update(id, data),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["habitaciones"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   // 4. Mutation para Eliminar
   const deleteMutation = useMutation({
      mutationFn: (id: number) => habitacionesAPI.delete(id),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["habitaciones"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   return {
      // Datos y estados
      habitaciones,
      isLoading,
      isError,
      // Acciones de mutación
      createHabitacion: createMutation.mutate,
      updateHabitacion: updateMutation.mutate,
      deleteHabitacion: deleteMutation.mutate,
      // Estados de carga de acciones (opcional para deshabilitar botones)
      isSaving: createMutation.isPending || updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
   };
};