const modificarCantidadProducto = (pedidoCompleto, idProducto, cantidad) => {
    const existe = pedidoCompleto.orden.some(valor => valor._id == idProducto);
    if (existe == true){
        const productoExistente = pedidoCompleto.orden.find(valor => valor._id == idProducto);
        productoExistente.cantidad = cantidad;
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
module.exports = modificarCantidadProducto;