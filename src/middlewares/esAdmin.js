//MIDDLEWARE Encargado de verificar si el usuario tiene rol de administrador
const usuarioModelo = require('../models/usuario.model');

const esAdmin = async (req, res, next) => {
    const { email } = req.user;
    const usuario = await usuarioModelo.findOne({email});
    if (usuario.isAdmin == true) {
        next()
    } else {
        res.status(401).json("Necesita permiso de administrador para realizar esta accion");
    }
};

module.exports = esAdmin;
