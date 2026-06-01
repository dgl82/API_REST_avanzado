const express = require("express"); //Importamos el paquete express
const cors = require("cors"); //Importamos el paquete cors
const app = express(); //Asignamos la instancia de express a la constante app
const puerto = 3000; //Definimos el puerto de escucha del servidor

//middlewares
app.use(cors()); //Habilitamos cors
app.use(express.json()); //Habilitamos el parseo de datos JSON

//Creamos el puerto de escucha
app.listen(puerto, console.log(`Servidor encendido escuchando puerto ${puerto}`));
