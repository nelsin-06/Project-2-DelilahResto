const verificarsiyaexisteelproducto = (pedidoCompleto, nombreProducto, cantidad) => {
    const existe = pedidoCompleto.orden.some(valor => valor.nombre == nombreProducto);
    if (existe == true){
        const productoExistente = pedidoCompleto.orden.find(valor => valor.nombre == nombreProducto);
        productoExistente.cantidad += cantidad;
        let cantidadTotal = 0;
        pedidoCompleto.orden.forEach(valor => {
            cantidadTotal += valor.cantidad * valor.precio;
        });
        pedidoCompleto.precio_total = cantidadTotal;
        return productoExistente;
    } else {
        return existe;
    }
};
module.exports = verificarsiyaexisteelproducto;