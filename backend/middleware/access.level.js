const Usuario = require("../models/usuario.model");

let accessLevelOptions = {}

accessLevelOptions.isAdmin = async (req, res, next) =>{
    const { user_id } = req.user.user_id;
    await Usuario.findOne({ user_id })
    .then(user =>{
      if(!user.es_administrador) {
        res.status(409).send("Solo un administrador puede ejecutar esta accion.");
        return;
      }
      next();
    })
    .catch(err => {
         res.status(500).send({message: err.message})
    });
};

accessLevelOptions.isUser = async (req, res, next) =>{
    const _id  = req.user.user_id;
    await Usuario.findOne({ _id })
    .then(user =>{
      if(!user.es_usuario) {
        res.status(409).send("Solo un usuario puede realizar esta accion.");
        return;
      }
      next();
    })
    .catch(err => {
         res.status(500).send({message: err.message})
    });
};

accessLevelOptions.isActive = async (req, res, next) =>{
    const { user_id } = req.user.user_id;
    await Usuario.findOne({ user_id })
    .then(user =>{
      if(!user.esta_activo) {
        res.status(409).send("El usuario debe de estar activo para realizar esta acción.");
        return;
      }
      next();
    })
    .catch(err => {
         res.status(500).send({message: err.message})
    });
};

module.exports = accessLevelOptions