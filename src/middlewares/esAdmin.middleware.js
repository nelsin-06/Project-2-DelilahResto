const { obtenerUser } = require("../models/usuario.model.js");
const express = require('express');     //requerir libreria express.
const app = express();
const basicAuth = require('express-basic-auth');

const esAdmin = app.use(basicAuth({
    authorizer: autorizacion = (email, password) => {
    const usuarios = obtenerUser().filter(u => u.email === email && u.isAdmin == true);
    if (usuarios.length <= 0) return false
    else return true;
}}));

module.exports = { esAdmin };