const express = require("express"); //Importamos el paquete express
const cors = require("cors"); //Importamos el paquete cors
require("dotenv").config(); //Cargamos las variables del .env
const app = express(); //Asignamos la instancia de express a la constante app
const puerto = process.env.PORT || 3000; //Definimos el puerto de escucha del servidor con la variables ocnfigurada en archivo .env o 3000 por defecto.
const { obtenerJoyas, obtenerJoyasConFiltros } = require("./consultas"); //Importamos las funciones del archivo consultas.js

//middlewares
app.use(cors()); //Habilitamos cors
app.use(express.json()); //Habilitamos el parseo de datos JSON

//Creamos el puerto de escucha
app.listen(puerto, console.log(`Servidor encendido escuchando puerto ${puerto}`));

//Rutas de consultas

//Ruta GET asíncrona
app.get("/joyas", async (req, res) => {
  //Try catch para manejar errores
  try {
    const joyas = await obtenerJoyas(req.query); //Llamamos la función con el límite como argumento
    res.status(200).json(joyas); //Respondemos al frontend con el objeto que contiene las joyas y mensaje 200.
  } catch (error) {
    console.error("Error en el endpoint GET /joyas:"); //Mostramos un mensaje en consola de la API
    res.status(500).json({
      //Respondemos al frontend con error 500 y mensaje formato JSON
      error: "Error interno del servidor",
    });
  }
});

//Ruta GET con filtros asíncrona
app.get("/joyas/filtros", async (req, res) => {
  //Try catch para manejar errores
  try {
    const joyas = await obtenerJoyasConFiltros(req.query);
    res.json(joyas);
  } catch (error) {
    console.error("Error en el endpoint GET /joyas/filtros:"); //Mostramos un mensaje en consola de la API
    res.status(500).json({
      //Respondemos al frontend con error 500 y mensaje formato JSON
      error: "Error interno del servidor",
    });
  }
});
