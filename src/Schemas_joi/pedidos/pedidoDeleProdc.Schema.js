const joi = require("joi");

const pedidoDelValidacion = joi.object().keys({
    idproducto: joi
        .string()
        .required()
        .length(24).message("Id del producto invalido")
        .messages({
            "number.base": `Ingrese un id de producto valido`,
            "any.required": `El producto es requerida`,
            "string.empty": `El producto es requerida`,
        }),
});

module.exports = pedidoDelValidacion;