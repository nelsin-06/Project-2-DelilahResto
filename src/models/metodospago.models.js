const mongoose = require("mongoose");

const metodoPagoSchema = new mongoose.Schema ({
    "medio": {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    }
});



module.exports = mongoose.model("metodosPago", metodoPagoSchema);   