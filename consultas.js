//Importamos la clase Pool del paquete pg

const { Pool } = require("pg");

//Importamos el paquete pg-format

const format = require("pg-format");

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
const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
  //Usamos try catch para manejar errores
  try {
    const [campo, direccion] = order_by.split("_"); //Indicamos que los parámetros para ORDER BY estarán separados por "_"
    const offset = Math.abs((page - 1) * limits); //Para calcular el offset
    //Consulta parametrizada que permite consultar con LIMIT y ORDER BY
    const formattedQuery = format("SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset);
    const { rows: joyas } = await pool.query(formattedQuery); //Extraemos el arreglo joyas de la respuesta de la consulta
    return joyas; //Devolvemos el arreglo que contiene las joyas
  } catch (error) {
    console.error("Error al obtener las joyas de la base de datos:", error.message); //Mostramos un mensaje por consola con el detalle del error
    throw error; //Devolvemos el error a la API para que responda con el mensaje 500 de la cláusula error de la ruta GET
  }
};

// Exportamos las funciones
module.exports = { obtenerJoyas };
