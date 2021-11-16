const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema ({
    "email": {
        type: String,
        unique: true,
        lowercase: true,
        require: true
    },
    "username": {
        require: true,
        type: String
    },
    "password": {
        type: String,
        require: true
    },
    "isAdmin": {
        type: Boolean,
        default: false
    },
    "telefono": {
        type: Number,
        require: true
    },
    "direccion": {
        type: String,
        require: true
    }
});

//Metodo encriptar contraseña
usuarioSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

//Metodo comparar contraseña encriptada
usuarioSchema.methods.matchPassword = async function(password){
return await bcrypt.compare(password, this.password);
}; 

module.exports = mongoose.model("Usuarios", usuarioSchema);