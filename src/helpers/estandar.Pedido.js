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

/*Se crea este estandar de modelo para que cuando el usuario haga el pedido se traiga y se ingrese solo la informacion deseada, 
necesaria y no explicita al modelo final de pedido.*/