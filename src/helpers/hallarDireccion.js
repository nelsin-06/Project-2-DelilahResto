const hallarDireccionUser = (array, idDireccion) => {
    const indexDireccion = array.findIndex(valor => {
        return valor.id == idDireccion;
    });
    if (indexDireccion === -1){
        return false
    } else {
        return array[indexDireccion];
    }
};

module.exports = hallarDireccionUser;