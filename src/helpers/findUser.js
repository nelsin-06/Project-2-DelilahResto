const usuarioModelo = require("../models/usuario.model")

const hallarUsuario = async (email, password) => {
    try{
        const user = await usuarioModelo.findOne({"email": email});
        if (user == undefined){
            return false
        } else if (user.email == email && user.password == password ){
            return true
        } else {return false}
}   catch (err){console.log(err)}
};

module.exports = hallarUsuario;
