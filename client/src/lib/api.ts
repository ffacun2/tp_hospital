
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

async function fetchAPI(endpoint: string, options?: RequestInit) {
   const URL = `${API_URL}${endpoint}`

   const response = await fetch(URL, {
      ...options,
      headers: {
         "Content-Type": "application/json",
         ...options?.headers,
      },
   })

   if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Error desconocido" }))
      throw new Error(error.message || "Error en la petición")
   }

   return response.json()
}

// Pacientes
export const pacientesAPI = {
   getAll: () => fetchAPI("/pacientes"),
   getById: (id: number) => fetchAPI(`/pacientes/${id}`),
   create: (data: any) => fetchAPI("/pacientes", { method: "POST", body: JSON.stringify(data) }),
   update: (id: number, data: any) => fetchAPI(`/pacientes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
   delete: (id: number) => fetchAPI(`/pacientes/${id}`, { method: "DELETE" }),
}

// Médicos
export const medicosAPI = {
   getAll: () => fetchAPI("/medicos"),
   getAllInfo: () => fetchAPI("/medicos/info"),
   getById: (id: number) => fetchAPI(`/medicos/${id}`),
   create: (data: any) => fetchAPI("/medicos", { method: "POST", body: JSON.stringify(data) }),
   update: (id: number, data: any) => fetchAPI(`/medicos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
   delete: (id: number) => fetchAPI(`/medicos/${id}`, { method: "DELETE" }),
}

// Sectores
export const sectoresAPI = {
   getAll: () => fetchAPI("/sectores"),
   getById: (id: number) => fetchAPI(`/sectores/${id}`),
   create: (data: any) => fetchAPI("/sectores", { method: "POST", body: JSON.stringify(data) }),
   update: (id: number, data: any) => fetchAPI(`/sectores/${id}`, { method: "PUT", body: JSON.stringify(data) }),
   delete: (id: number) => fetchAPI(`/sectores/${id}`, { method: "DELETE" }),
}

// Habitaciones
export const habitacionesAPI = {
   getAll: () => fetchAPI("/habitaciones"),
   getById: (id: number) => fetchAPI(`/habitaciones/${id}`),
   create: (data: any) => fetchAPI("/habitaciones", { method: "POST", body: JSON.stringify(data) }),
   update: (id: number, data: any) => fetchAPI(`/habitaciones/${id}`, { method: "PUT", body: JSON.stringify(data) }),
   delete: (id: number) => fetchAPI(`/habitaciones/${id}`, { method: "DELETE" }),
}

// Internaciones
export const internacionesAPI = {
   getAll: () => fetchAPI("/internaciones"),
   getById: (id: number) => fetchAPI(`/internaciones/${id}`),
   create: (data: any) => fetchAPI("/internaciones", { method: "POST", body: JSON.stringify(data) }),
   update: (id: number, data: any) => fetchAPI(`/internaciones/${id}`, { method: "PUT", body: JSON.stringify(data) }),
   delete: (id: number) => fetchAPI(`/internaciones/${id}`, { method: "DELETE" }),
}

// Guardias
export const guardiasAPI = {
   getAll: () => fetchAPI("/guardias"),
   getById: (id: number) => fetchAPI(`/guardias/${id}`),
   create: (data: any) => fetchAPI("/guardias", { method: "POST", body: JSON.stringify(data) }),
   update: (id: number, data: any) => fetchAPI(`/guardias/${id}`, { method: "PUT", body: JSON.stringify(data) }),
   delete: (id: number) => fetchAPI(`/guardias/${id}`, { method: "DELETE" }),
}

//Enums de la base de datos
export const enumsAPI = {
   getTipoSexo: () => fetchAPI("/config/enums/sexo"),
   getOrientacion: () => fetchAPI("/config/enums/orientacion"),
}

// Especialidades
export const especialidadesAPI = {
   getAll: () => fetchAPI("/especialidades"),
   create: (data: any) => fetchAPI("/especialidades", { method: "POST", body: JSON.stringify(data) }),
   delete: (id: number) => fetchAPI(`/especialidades/${id}`, { method: "DELETE" }),
   update: (id: number, data: any) => fetchAPI(`/especialidades/${id}`, { method: "PUT", body: JSON.stringify(data) }),
}

export const reportesAPI = {
   getCamasDisponiblesResumen: () => fetchAPI("/reportes/camas-disponibles-sector"),
   getCamasDisponiblesDetalle: () => fetchAPI("/reportes/camas-disponibles-detalle"),
}