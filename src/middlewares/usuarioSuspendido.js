const usuarioModelo = require('../models/usuario.model');

const estadoUser = async (req, res, next) => {
    const { email } = req.user;
    const usuario = await usuarioModelo.findOne({email});
    if (usuario.estado == true) {
        next()
    } else {
        res.status(401).json('Su cuenta se encuentra suspendida, comuniquese con el administrador');
    }
};

module.exports = estadoUser;