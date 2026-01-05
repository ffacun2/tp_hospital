# Sistema de Gestión Hospitalaria
Este proyecto es una aplicación web integral diseñada para gestionar pacientes, personal médico, internaciones y seguimiento clínico. <br>
El enfoque principal fue el diseño de la base de datos, diagrama ENTIDAD - RELACION, normalización, Triggers y Procedures.

## 🚀 Arquitectura del Proyecto
El sistema utiliza un stack PERN (PostgreSQL, Express, React, Node.js) con un fuerte enfoque en TypeScript para garantizar la integridad de los datos en todas las capas.
## 🛠️ Servidor (Backend)
El backend se realizó en una Arquitectura de Capas, lo que facilita el mantenimiento y escalado.

**Estructura de Carpetas**
- `/src/config:` Gestión de la conexión a la base de datos mediante un Pool de PostgreSQL.
- `/src/services:` Capa de acceso a datos. Contiene consultas.
- `/src/controllers:` Orquestación de la lógica HTTP. Recibe req, res y maneja los estados de respuesta (200, 201, 400, 500).
- `/src/routes:` Definición de endpoints desacoplada de la lógica.
- `/src/types:` Centralización de interfaces y DTOs (Data Transfer Objects).

**Características Técnicas**
- **Transacciones:** Implementación de BEGIN, COMMIT y ROLLBACK en servicios complejos (como la creación de médicos con especialidades) para asegurar la consistencia.
- **Inyección SQL Prevenida:** Uso de consultas parametrizadas y la función UNNEST para inserciones múltiples.
- **Respuestas Estructuradas:** Consultas que devuelven objetos JSON anidados directamente desde la base de datos para evitar el sobreprocesamiento en Node.js.
## 💻 Cliente (Frontend)
Desarrollado con React y TypeScript, enfocado en una experiencia de usuario fluida y tipada.

**Componentes Principales**
- **Gestión de Formularios:** Uso de `react-hook-form` para validación dinámica y manejo de estados complejos (objetos anidados).
- **Navegación:** Implementación de `react-router-dom` con manejo de parámetros dinámicos (useParams) y estados de navegación (useLocation).
- **Vistas de Detalle:** Componentes especializados para "Seguimiento de Internación" y "Perfil de Médico" con carga de datos asíncrona.
- **UI Dinámica:** Lógica de visualización basada en datos, como la selección automática de avatars/iconos según el sexo del profesional.
- **EstiloTailwind CSS:** Diseño limpio con enfoque en tablas hospitalarias legibles, uso de gradientes y componentes responsivos.

## 🗄️ Base de Datos (PostgreSQL)
El diseño de la base de datos sigue un modelo relacional estricto con las siguientes particularidades:
- **Normalización:** Aplicación de **Forma Normal Boyce-Codd**.
- **Relaciones N:M:** Implementadas mediante tablas intermedias como especializado_en (Médico-Especialidad) y corresponde (Internación-Cama).
- **Entidades Débiles:** La tabla CAMA se maneja como una entidad débil cuya identidad depende de HABITACION.
- **Tipos ENUM:** Uso de tipos personalizados para columnas como sexo o tipo_sector para restringir valores válidos.
- **Integridad Referencial:** Uso intensivo de llaves primarias compuestas y foráneas para mantener la trazabilidad de los pacientes.
- **Automatizaciones:** 
   - **Triggers:** Validación automática de disponibilidad de camas y consistencia en los estados de guardia.
   - **Procedures:** Lógica de nogicio encapsulada en la DB para procesos críticos de alta médica e ingreso.

## 📋 Endpoints Principales

| Método | Ruta | Descripción | 
| :----- | :---: | --------: |
| GET | /pacientes | Lista ordenada de todos los pacientes. |
| POST | /api/medicos | Crea un médico y sus especialidades (Transaccional). |
| PUT | /api/medicos/:id | Actualización completa de staff médico. |
| GET | /api/internaciones | Resumen de internaciones con objetos anidados.| 
| GET | /internaciones/:id/seguimiento | Detalle completo incluyendo cama, habitación y sector. |
| GET | /config/enums/:typename | Lista de elementos del enum especificado `:typename` de la base de datos |
| GET | /reportes/camas-disponibles-sector | Informe de cantidad de camas disponibles por sector|
| GET | /reportes/camas-disponibles-detalle | Informe de las camas disponibles |
## 🛠️ Instalación y Configuración

- Configurar variables de entorno para PostgreSQL en `src/config/db.ts`.

   ``` .env
   /server/.env
   #Database Configuration
   DB_USER=
   DB_USER=
   DB_HOST=
   DB_NAME=
   DB_PASSWORD=
   DB_PORT=

   #Server Configuration
   PORT=
   
   ```
**Ejecución**
- Desde la raíz del repositorio:
   -  **Ejecutar cliente:**`npm run dev:client`
   - **Ejecutar servidor:**`npm run dev:server`
- Desde forma individual:
   - **Server:** `cd server && npm install`
   - **Cliente:** `cd cliente && npm run dev`
