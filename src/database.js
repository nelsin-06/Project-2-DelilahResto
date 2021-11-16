const mongoose = require('mongoose');
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
    db.on('open', () => console.log("conectado a la bd"));
    db.on('error', (err) => console.log(err));