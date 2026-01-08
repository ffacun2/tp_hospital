import z from "zod";

const pacienteSchema = z.object({
   nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
   apellido: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
   dni: z.number().min(6, "El DNI debe tener al menos 6 digitos"),
   fecha_nac: z.string().min(1, "La fecha de nacimiento es obligatoria"),
   domicilio: z.string().min(3, "El domicilio debe tener al menos 3 caracteres"),
   telefono: z.string().regex(/^[0-9]{10}$/, "El telefono debe tener 10 digitos"),
   sexo: z.string().min(1, "El sexo es obligatorio").refine((val) => ["Masculino", "Femenino", "Otro"].includes(val), "El sexo debe ser Masculino, Femenino o Otro"),
})

export type PacienteFormInputs = z.infer<typeof pacienteSchema>