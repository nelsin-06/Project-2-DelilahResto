const mongoose = require("mongoose");

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

module.exports = mongoose.model("Usuarios", usuarioSchema);