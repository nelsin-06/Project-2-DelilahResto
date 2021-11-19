const joi = require("joi");

const pedidoValidation = joi.object().keys({
    id_producto: joi
        .string()
        .required()
        .length(24).message("Id del producto invalido")
        .messages({
            "number.base": `Ingrese un id de producto valido`,
            "any.required": `El producto es requerida`,
            "string.empty": `El producto es requerida`,
        }),
    cantidad: joi
        .number()
        .required()
        .messages({
            "number.base": `Ingrese una cantidad de producto valida`,
            "any.required": `La cantidad del producto es requerida`,
            "string.empty": `La cantidad del producto es requerida`,
        }),
    id_direccion: joi
        .number()
        .required()
        .messages({
            "number.base": `El id de la direccion solo contiene numeros`,
            "any.required": `La direccion es requerida`,
            "string.empty": `La direccion es requerida`,
        }),
    id_metodo_pago: joi
        .string()
        .required()
        .length(24).message("Id de metodo de pago invalido")
        .messages({
            "string.base": `Ingrese un id de metodo de pago valido`,
            "any.required": `El metodo de pago es requerido`,
            "string.empty": `El metodo de pago es requerido`,
        }),
});
module.exports = pedidoValidation;
