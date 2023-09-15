const Estados = require("../models/ticket.estados.model");

let estadosOpciones = {}

estadosOpciones.verifyIfStatusExist = async (req, res, next) =>{
    const { nombre } = req.body;
    await Estados.findOne({ nombre })
    .then(estado =>{
      if(estado) {
        res.status(409).send("Este estado ya existe, intente con otro nombre.");
        return;
      }
      next();
    })
    .catch(err => {
         res.status(500).send("Hubo un error contacte al administrador.")
         return;
    });
};

estadosOpciones.verifyRequiredFields = (req, res, next) => {
  const { nombre, color } = req.body;
  hasRequestAllRequiredFields = nombre && color
  if (!hasRequestAllRequiredFields) {
      res.status(400).send("Todos los campos son requeridos.");
      return;
    }
  next();

};

module.exports = estadosOpciones;