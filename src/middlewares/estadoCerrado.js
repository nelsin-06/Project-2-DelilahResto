//Middleware verificamos que el usuario no tenga mas de un pedido activo en el restaurante
const pedidoModelo = require("../models/pedidos.model");

const estadoCerrado = async (req, res, next) => {
    try {
    const { email } = req.user;
    const pedidos = await pedidoModelo.find({"usuario.email": email});
    const verificacion = pedidos.every(valor => valor.estado_pedido == "CERRADO");
    if (verificacion == true) {
        next();
    } else {
        res.status(400).json("Aun tiene un pedido en proceso, espere a que termine para poder realizar uno nuevamente");
    }
} catch (err) {
    res.json("INTERNAL SERVER ERROR=500")
}
};

module.exports = estadoCerrado;
