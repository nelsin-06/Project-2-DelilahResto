const joi = require("joi");

const usuarioValidation = joi.object().keys({
        email: joi
                .string()
                .required()
                .email({
            minDomainSegments: 2, 
            tlds: { allow: ['com', 'net', 'co', 'org'] },}).message("Correo invalido"),
        username: joi
                .string()
                .required()
                .min(5)
                .max(30)
                .messages({
                        "string.base": `Username invalido`,
                        "string.empty": `El username no puede estar vacio`,
                        "string.min": `El username debe tener una logitud minima de {#limit}`,
                        "string.max": `El username debe tener una logitud maxima de {#limit}`,
                        "any.required": `Username es requerido`,
                      }),
        password: joi
                .string().$
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message('Caracteres no permitidos en la contrasena')
                .min(8).message("La contrasena debe tener minimo 8 caracteres")
                .required()
                .max(64).message("La contrasena debe tener maximo 64 caracteres"),
        confirm_password: joi
                .ref('password'),
        telefono: joi
                .string()
                .required()
                .length(10).message("La logitud del numero telefonico debe ser de 10 digitos")
                .pattern(/^[0-9]+$/).message("Numero de telefono incorrecto")
                .messages({
                        "string.base": `Numero de telefono invalido`,
                        "any.required": `Telefono es requerido`,
                        "string.empty": `Numero de telefono es requerido`,
                }),
        direccion: joi
                .array()
                .required()
                .messages({
                        "array.base": `Se debe ingresar una direccion valida`,
                        "array.empty": `La direccion es requerida`,
                }),
        isAdmin: joi
                .boolean()
});

module.exports = usuarioValidation;
