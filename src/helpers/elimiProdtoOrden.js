const eliminarProductoDeOrden = (array, idProducto) => {
    const indexOrden = array.findIndex(product => {
        return product._id == idProducto;
    });
    if (indexOrden === -1){
        return false
    } else {
        const dato = array.splice(indexOrden, 1);
        
    };
};
module.exports = eliminarProductoDeOrden; 