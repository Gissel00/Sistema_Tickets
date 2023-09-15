const jwt = require("jsonwebtoken");
const config = require("../config/jwt.config")


let jwtActions = {};

//JSON Web Tokens
jwtActions.verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.params.token || req.headers["x-access-token"];

  if (!token) {
    res.status(403).send("Un token es requerido para esta solicitud.");
    return;
  }
  const getScrypt = token.split(' ');
  const loginToken = getScrypt.find(value => value !== 'Bearer');
  try {
    const decoded = jwt.verify(loginToken, config.keys.secret);
    req.user = decoded;
  } catch (err) {
    res.status(401).send("El token es invalido.");
    return; 
  }

  next();
  return;
};

jwtActions.createToken = (id, email) => {
  return jwt.sign(
    { 
      user_id: id, email 
    },
      config.keys.secret,
    {
      expiresIn: config.keys.expiresIn,
    }
  );
};

module.exports = jwtActions;