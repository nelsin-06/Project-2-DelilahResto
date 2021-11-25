const mongoose = require('mongoose');
const usuarioModelo = require('./models/usuario.model');
const productoModelo = require('./models/producto.model');
const metoPagoModelo = require('./models/metodospago.models');
const { encryptPassword } = require('./helpers/bcrypt.methods');
const { MONGODB_HOST_AND_PORT, MONGODB_NAME_DATABASE } = process.env;
const URI = `mongodb://${MONGODB_HOST_AND_PORT}/${MONGODB_NAME_DATABASE}`;
const db = mongoose.connection;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

(async () => {
    try {
        await mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true });
}   catch (err) {
        console.log("ERROR AL CORRER BASE DE DATOS >>>>>>>" + err);
}
})
();
    db.on('open', async () => {console.log("conectado a la bd")
    const datosDefault = await usuarioModelo.findOne();
    if (datosDefault == null){
    const userNew = await new usuarioModelo({
        email: 'correo1@gmail.com',
        username: 'correo uno dos',
        password: await encryptPassword('passwordsecreto'),
        telefono: '3991234568',
        direccion: [{direccion: 'direccion 1 #1-2', id: 999}],
        isAdmin: true,
    });
    await userNew.save();

    const productNew = await new productoModelo({
        nombre: "Carne asada",
        precio: "10000",
    });
    await productNew.save();

    const metNew = await new metoPagoModelo({
        medio: 'Nequi'
    });
    await metNew.save()
    }
});
    db.on('error', (err) => console.error(err));

