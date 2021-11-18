require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

require("./database");

const PORT = 3000;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
// const swaggerSpecs = swaggerJsDoc(swaggerOptions);

//app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpecs))

const rutasUsuarios = require("./route/usuarios.route");
const rutasProductos = require("./route/productos.route");
const rutasPedidos = require("./route/pedidos.route");
const rutasPagos = require("./route/metodosdepago.route");
app.use('/metodopagos', rutasPagos);
app.use('/usuarios', rutasUsuarios);
app.use('/productos', rutasProductos);
app.use('/pedidos', rutasPedidos);

app.listen(PORT, () => { console.log("index iniciado en el puerto: " + PORT); });