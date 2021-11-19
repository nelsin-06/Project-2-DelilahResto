const joi = require("joi");

const pedidoCantidadValidacion = joi.object().keys({
    idproducto: joi
        .string()
        .required()
        .length(24).message("Id del producto invalido")
        .messages({
            "number.base": `Ingrese un id de producto valido`,
            "any.required": `El producto es requerida`,
            "string.empty": `El producto es requerida`,
        }),
    cantidadproducto: joi
        .number()
        .required()
        .messages({
            "number.base": `Ingrese una cantidad de producto valida`,
            "any.required": `La cantidad del producto es requerida`,
            "string.empty": `La cantidad del producto es requerida`,
        }),
});

module.exports = pedidoCantidadValidacion;