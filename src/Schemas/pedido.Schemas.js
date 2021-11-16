const mongoose = require("mongoose");

const datosUsuarioSchema = new mongoose.Schema({
    "username": String,
    "telefono": Number,
    "_id": String
})

const datosOrdenSchema = new mongoose.Schema ({
    "nombre": String,
    "precio": Number,
    "cantidad": Number
});

const datosMetodoPagoSchema = new mongoose.Schema ({
    "medio": String
})

module.exports = {datosOrdenSchema, datosUsuarioSchema, datosMetodoPagoSchema};