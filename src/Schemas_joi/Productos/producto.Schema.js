const joi = require("joi");

const validationAggProduct = joi.object().keys({
    nombre: joi
        .string()
        .required()
        .messages({
            "string.base": `Nombre invalido`,
            "string.empty": `El nombre del producto no puede estar vacio`,
            "any.required": `El nombre es requerido`,
        }),
    precio: joi
        .number()
        .required()
        .messages({
            "number.base": `Precio invalido`,
            "number.empty": `El precio del producto no puede estar vacio`,
            "any.required": `El precio es requerido`,
        }),
});
module.exports = validationAggProduct;