const msgErrorjwt = (err, req, res, next) => {
    if (err.name == 'UnauthorizedError') {
      res.status(401).send('invalid token...');
    } else { res.status(500).json("INTERNAL_SERVER_ERROR=500 MIDDLEWARE DE AFUERA") }
  };

module.exports = msgErrorjwt;