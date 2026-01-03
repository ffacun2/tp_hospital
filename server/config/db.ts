import { Pool } from "pg";
import { loadEnvFile } from "node:process";

loadEnvFile("./.env");

// Database connection
export const pool = new Pool({
   user: process.env.DB_USER || "postgres",
   host: process.env.DB_HOST || "localhost",
   database: process.env.DB_NAME || "hospital_bd",
   password: process.env.DB_PASSWORD || "postgres",
   port: Number.parseInt(process.env.DB_PORT || "5432"),
});

// Test database connection
pool.connect((err, client, release) => {
   if (err) {
      console.error("Error connecting to database:", err);
   } else {
      console.log("Database connected successfully");
      release();
   }
});