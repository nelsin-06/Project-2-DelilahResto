const joi = require("joi");

const usuarioValidation = joi.object().keys({
        email: joi
                .string().$
                .email({ 
            minDomainSegments: 2, 
            tlds: { allow: ['com', 'net', 'co', 'org'] },}).message("Correo invalido"),
        username: joi
                .string()
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
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .message('Caracteres no permitidos en la contrasena'),
        confirm_password: joi
                .ref('password'),
        telefono: joi
                .string()
                .required()
                .length(10).message("La logitud del numero telefonico debe ser de 10 digitos")
                .pattern(/^[0-9]+$/).message("Numero de telefono incorrecto")
                .messages({
                        "string.base": `Solo numeros`,
                        "any.required": `Numero de telefono requerido`,
                        "string.empty": `El numero de telefono es requerido`,
                }),
        direccion: joi
                .string()
                .required()
                .messages({
                        "string.base": `Se debe ingresar una direccion valida`,
                        "string.empty": `La direccion es requerida`,
                }),
        isAdmin: joi
                .boolean(),
});

module.exports = usuarioValidation;
