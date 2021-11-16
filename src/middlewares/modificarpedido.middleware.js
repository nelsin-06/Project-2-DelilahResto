//Funcion validar si valor es un numero
function esNumero(valor) {
    const validarPrecio = typeof valor === "number";
    return validarPrecio
};

//Funcion valirdar si valor es un string
function esString(valor) {
    const validarPrecio = typeof valor === "string";
    return validarPrecio
};

module.exports = {esNumero, esString};