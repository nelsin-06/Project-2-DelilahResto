const redis = require('redis');
const clienteRedis = redis.createClient(6379);

const cache = (req, res, next) => {
    clienteRedis.get( 'PRODUCTOS', (err, productos) => {
        if (err) throw err;

        if (productos) {
            res.status(200).json(JSON.parse(productos));
        } else {
            next();
        }
    });
}

module.exports = cache;
