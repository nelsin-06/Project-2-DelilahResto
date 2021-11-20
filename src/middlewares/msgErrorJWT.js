const msgErrorjwt = (err, req, res, next) => {
    if (err.name == 'UnauthorizedError') {
      res.status(401).send('SE DEBE INICIAR SESION');
    } else { res.status(500).json("INTERNAL_SERVER_ERROR=500 MIDDLEWARE DE AFUERA") }
  };

module.exports = msgErrorjwt;