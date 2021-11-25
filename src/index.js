require('dotenv').config();
const {configSwaggerServer, configSwaggerSetup, configSwaggerSpecs} = require('./utils/swaggerconfig');
const helmet = require("helmet");
const msgErrorjwt = require("./middlewares/msgErrorJWT");
const configJWT = require('./middlewares/config.JWT')
const express = require('express');
const app = express();
app.use(helmet());
app.use(express.json());
const estadoUser = require('./middlewares/usuarioSuspendido');

require("./database");

const PORT = process.env.PORT || 3020;

app.use('/swagger', configSwaggerServer, configSwaggerSetup(configSwaggerSpecs));

app.use(configJWT());
app.use(msgErrorjwt);

const rutasUsuarios = require("./route/usuarios.route");
const rutasProductos = require("./route/productos.route");
const rutasPedidos = require("./route/pedidos.route");
const rutasPagos = require("./route/metodosdepago.route");

app.use('/metodopagos', estadoUser,rutasPagos);
app.use('/usuarios', rutasUsuarios);
app.use('/productos', estadoUser, rutasProductos);
app.use('/pedidos', estadoUser, rutasPedidos);


app.listen(PORT, () => { console.log("index iniciado en el puerto: " + PORT); });

module.exports = app;

// ⛩️⚙️💻⛩️