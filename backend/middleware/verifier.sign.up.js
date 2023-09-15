const Usuario = require("../models/usuario.model");

let signUp = {}

signUp.verifyIfUserExist = async (req, res, next) =>{
    const { email } = req.body;
    await Usuario.findOne({ email })
    .then(user =>{
      if(user) {
        res.status(409).send("Esta cuenta ya existe. Utiliza un correo diferente.");
        return;
      }
      next();
    })
    .catch(err => {
         res.status(500).send({message: err.message})
    });
};

signUp.verifyRequiredFields = (req, res, next) => {
    const { nombres, apellidos, email, password } = req.body;
    hasRequestAllRequiredFields = email && password && nombres && apellidos
    if (!hasRequestAllRequiredFields) {
        res.status(400).send("Todos los campos son requeridos. Prueba");
        return;
      }
    next();
  
};

module.exports = signUp;