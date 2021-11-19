const mongoose = require("mongoose");
const {datosOrdenSchema, datosUsuarioSchema, datosMetodoPagoSchema} = require("../helpers/estandar.Pedido");

const pedidoSchema = new mongoose.Schema({
    "usuario": datosUsuarioSchema,
    "orden": [datosOrdenSchema],
    "precio_total": {
        type: Number
    },
    "direccion_pedido": {
        type: Object,
        required: true
    },
    "estado_pedido": {
        type: String,
        uppercase: true,
    },
    "metodo_pago": datosMetodoPagoSchema
});

module.exports = mongoose.model("Pedidos", pedidoSchema)
