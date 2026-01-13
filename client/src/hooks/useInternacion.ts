import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { internacionesAPI } from "../lib/api";
import type { Internacion } from "../types/types";

export const useInternaciones = () => {
   const queryClient = useQueryClient();

   // 1. Query para obtener la lista completa
   const { data: internaciones = [], isLoading, isError, refetch } = useQuery<Internacion[]>({
      queryKey: ["internaciones"],
      queryFn: internacionesAPI.getAll,
   });

   // 2. Mutation para Crear
   const createMutation = useMutation({
      mutationFn: (nuevo: Omit<Internacion, 'id'>) => internacionesAPI.create(nuevo),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["internaciones"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   // 3. Mutation para Editar
   const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: number; data: Partial<Omit<Internacion, 'id'>> }) =>
         internacionesAPI.update(id, data),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["internaciones"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   // 4. Mutation para Eliminar
   const deleteMutation = useMutation({
      mutationFn: (id: number) => internacionesAPI.delete(id),
      onSuccess: () => {
         return queryClient.invalidateQueries({ queryKey: ["internaciones"] });
      },
      onError: (error: any) => {
         console.error("Error: ", error)
      }
   });

   return {
      // Datos y estados
      internaciones,
      isLoading,
      isError,
      refetch,
      // Acciones de mutación
      createInternacion: createMutation.mutate,
      updateInternacion: updateMutation.mutate,
      deleteInternacion: deleteMutation.mutate,
      // Estados de carga de acciones (opcional para deshabilitar botones)
      isSaving: createMutation.isPending || updateMutation.isPending,
      isDeleting: deleteMutation.isPending,
      refetchInternaciones: queryClient.refetchQueries({ queryKey: ["internaciones"], type: 'active' }),
   };
};