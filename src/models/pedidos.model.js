const mongoose = require("mongoose");
const {datosOrdenSchema, datosUsuarioSchema, datosMetodoPagoSchema} = require("../Schemas/pedido.Schemas");

const pedidoSchema = new mongoose.Schema({
    "usuario": datosUsuarioSchema,
    "orden": [datosOrdenSchema],
    "precio_total": {
        type: Number
    },
    "direccion_pedido": {
        type: String,
        required: true
    },
    "estado_pedido": {
        type: String,
        default: "PENDIENTE"
    },
    "metodo_pago": datosMetodoPagoSchema
});

module.exports = mongoose.model("Pedidos", pedidoSchema)
