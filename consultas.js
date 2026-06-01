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

//Función para obtener todas las joyas con LIMIT, ORDER BY y PAGE
const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1 }) => {
  //Usamos try catch para manejar errores al consultar la BD
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

//Función para obtener las joyas con filtros y parametrizados
const obtenerJoyasConFiltros = async ({ precio_max, precio_min, categoria, metal }) => {
  //Usamos try catch para manejar errores al consultar la BD
  try {
    let filtros = []; //Iniciamos el arreglo filtros vacío
    const values = []; //Iniciamos el arreglo values vacío

    //Función auxiliar para automatizar el llenado de los arreglos "filtros" y "values"
    const agregarFiltro = (campo, comparador, valor) => {
      //Función que recibe 3 argumentos
      values.push(valor); //Se agrega al arreglo "valor" el valor recibido en la consulta
      const { length } = filtros; //Se lee la longitud del arreglo "filtros"
      filtros.push(`${campo} ${comparador} $${length + 1}`); //Agregamos al arreglo "filtros" el filtro construído parametrizando el valor recibido en la consulta
    };

    //Evaluamos la existencia de filtros para agregarlos o no
    if (precio_max) agregarFiltro("precio", "<=", precio_max); //Si el filtro precio_max existe y su valor
    if (precio_min) agregarFiltro("precio", ">=", precio_min); //Si el filtro precio_min existe y su valor
    if (categoria) agregarFiltro("categoria", "=", categoria); //Si el filtro categoria existe y su valor
    if (metal) agregarFiltro("metal", "=", metal); //Si el filtro metal existe y su valor

    //Se construye la consulta final concatenando (si hay filtros) los filtros a la consulta original
    let consulta = "SELECT * FROM inventario"; //Consulta base que selecciona todos los registros
    //Si hay filtros se concatenan a la consulta con operador AND
    if (filtros.length > 0) {
      filtros = filtros.join(" AND ");
      consulta += ` WHERE ${filtros}`;
    }

    const { rows: joyas } = await pool.query(consulta, values); //Extraemos el arreglo joyas de la respuesta de la consulta
    return joyas; //Devolvemos el arreglo que contiene las joyas
  } catch (error) {
    console.error("Error al obtener las joyas de la base de datos:", error.message); //Mostramos un mensaje por consola con el detalle del error
    throw error; //Devolvemos el error a la API para que responda con el mensaje 500 de la cláusula error de la ruta GET
  }
};

//Función para formatear los datos a HATEOAS
const prepararHATEOAS = (joyas) => {
  const stockTotal = joyas.reduce((acumulado, joya) => acumulado + joya.stock, 0); //Calculamos el stock total sumando el stock de las joyas devueltas en el arreglo de la consulta
  //Hacemos map al arreglo joyas para extraer solo 'name' y construir el 'href' con el id de cada joya en un nuevo arreglo
  const results = joyas.map((joya) => ({
    name: joya.nombre,
    href: `/joyas/joya/${joya.id}`,
  }));

  //Retornamos la estructura HATEOAS con los datos de las joyas devueltas en la consulta
  return {
    totalJoyas: joyas.length, //Mostramos la cantidad total de joyas devueltas en la consulta
    stockTotal, //La suma total del stock de las joyas de la consulta
    results, //Arreglo con el nombre y enlace de cada joya de la consulta
  };
};

// Exportamos las funciones
module.exports = { obtenerJoyas, obtenerJoyasConFiltros, prepararHATEOAS };
