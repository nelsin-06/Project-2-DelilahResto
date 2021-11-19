const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema ({
    "email": {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    "username": {
        type: String,
        required: true,
    },
    "password": {
        type: String,
        required: true,
    },
    "isAdmin": {
        type: Boolean,
        default: false,
    },
    "telefono": {
        type: Number,
        required: true,
    },
    "direccion": {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Usuarios", usuarioSchema);
