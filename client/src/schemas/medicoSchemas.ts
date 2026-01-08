import z from "zod";

const medicoSchema = z.object({
   nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
   apellido: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
   matricula: z.number().min(6, "La matricula debe tener al menos 6 digitos"),
   dni: z.number().min(6, "El DNI debe tener al menos 6 digitos"),
   telefono: z.string().regex(/^[0-9]{10}$/, "El telefono debe tener 10 digitos"),
})

export type MedicoFormInputs = z.infer<typeof medicoSchema>