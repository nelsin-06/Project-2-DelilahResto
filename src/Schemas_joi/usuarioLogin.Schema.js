const joi = require("joi");

const loginValidation = joi.object().keys({
    email: joi
        .string().$
        .email({ 
            minDomainSegments: 2, 
            tlds: { allow: ['com', 'net', 'co', 'org'] },}).message("Correo invalido"),
    password: joi
        .string().$
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .message('Caracteres no permitidos en la contrasena'),
});

module.exports = loginValidation;