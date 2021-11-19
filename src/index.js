require('dotenv').config();
const express = require('express');
const expressJWT = require("express-jwt");
const msgErrorjwt = require("./middlewares/msgErrorJWT");
const helmet = require("helmet");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3020;

app.use(helmet());
/*
app.use(
    expressJWT({
        secret: process.env.PASS,
        algorithms: ['HS256'],
    }).unless({
        path: ['/usuarios/ingresar', '/usuarios/obtenerusuarios', '/usuarios/registrar'],
    }),
);
*/

app.use(msgErrorjwt);

require("./database");

const swaggerOptions = require("./utils/swaggerOptions");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = swaggerJsDoc(swaggerOptions);

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

const rutasUsuarios = require("./route/usuarios.route");
const rutasProductos = require("./route/productos.route");
const rutasPedidos = require("./route/pedidos.route");
const rutasPagos = require("./route/metodosdepago.route");
app.use('/metodopagos', rutasPagos);
app.use('/usuarios', rutasUsuarios);
app.use('/productos', rutasProductos);
app.use('/pedidos', rutasPedidos);

app.listen(PORT, () => { console.log("index iniciado en el puerto: " + PORT); });