const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema ({
    "nombre": {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    "precio": {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Productos", productoSchema);