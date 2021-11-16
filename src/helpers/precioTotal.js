const precioTotal = (ordenCompleta) => {
    let precioTotal = 0;
    ordenCompleta.orden.forEach(valor => {
       precioTotal += valor.cantidad * valor.precio;     
    });
    ordenCompleta.precio_total = precioTotal;
};

module.exports = precioTotal;