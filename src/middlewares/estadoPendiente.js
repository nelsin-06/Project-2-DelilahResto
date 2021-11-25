//Funcion para validar si su pedido esta confirmado

const pedidoModelo = require('../models/pedidos.model');

const estadoConfirmado = async (req, res, next) => {
    const { idpedido: _id } = req.params;
    const pedido = await pedidoModelo.findById({ _id });
    if (pedido.estado_pedido == "PENDIENTE"){
        next();
    } else {res.status(400).json("El pedido ya se confirmo, no se pueden realizar modificaciones")}
};

module.exports = estadoConfirmado;