const Prioridad = require('../models/ticket.prioridades.model');

prioridadOpciones = {}

prioridadOpciones.verifyIfPriorityExist = async (req, res, next) =>{
    const { nombre } = req.body;
    await Prioridad.findOne({ nombre })
    .then(prioridad =>{
      if(prioridad) {
        res.status(400).send("Esta prioridad ya existe, intente con otro nombre.");
        return;
      }
      next();
    })
    .catch(err => {
         res.status(500).send("Hubo un error contacte al administrador.")
         return;
    });
};

prioridadOpciones.verifyRequiredFields = (req, res, next) => {
    const { nombre, color } = req.body;
    hasRequestAllRequiredFields = nombre && color
    if (!hasRequestAllRequiredFields) {
        res.status(400).send("Todos los campos son requeridos.");
        return;
      }
    next();
  };
  
  module.exports = prioridadOpciones;