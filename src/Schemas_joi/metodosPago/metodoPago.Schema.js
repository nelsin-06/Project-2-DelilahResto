const joi = require("joi");

const metodoPagoValidacion = joi.object().keys({
    medio: joi
        .string()
        .required()
        .messages({
            "number.base": `Ingrese metodo de pago valido`,
            "any.required": `Metodo de pago es requerido`,
            "string.empty": `Metodo de pago es requerido`,
        }),
});

module.exports = metodoPagoValidacion;
