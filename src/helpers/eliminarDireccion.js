const eliminarDireccionUsuario = (array, idDireccion) => {
    const indexOrden = array.findIndex(valor => {
        return valor.id == idDireccion;
    });
    if (indexOrden === -1){
        return false
    } else {
        const dato = array.splice(indexOrden, 1);
    };
};
module.exports = eliminarDireccionUsuario;