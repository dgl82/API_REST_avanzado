//Importamos la clase Pool del paquete pg

const { Pool } = require("pg");

//Importamos el paquete "dotenv"

require("dotenv").config();

//Creamos una instancia de la clase Pool usando un objeto de configuración con variables de entorno del archivo .env

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  allowExitOnIdle: process.env.DB_ALLOW_EXIT === "true",
});

//Funciones para consultas SQL

//Función para obtener las joyas
const obtenerJoyas = async ({ limit = 10 }) => {
  try {
    const consulta = "SELECT * FROM joyas LIMIT $1";
    const { rows: joyas } = await pool.query(consulta, [limit]);
    return joyas;
  } catch (error) {
    console.error("Error al obtener las joyas de la base de datos:", error.message);
    throw error;
  }
};

// Exportamos las funciones
module.exports = { obtenerJoyas };
