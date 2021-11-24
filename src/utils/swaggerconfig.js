const swaggerOptions = require("./swaggerOptions");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = swaggerJsDoc(swaggerOptions);

const configSwaggerServer = swaggerUI.serve;
const configSwaggerSetup = swaggerUI.setup;
const configSwaggerSpecs = swaggerSpecs;

module.exports = {configSwaggerServer, configSwaggerSetup, configSwaggerSpecs}