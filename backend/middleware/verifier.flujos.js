const Flujos = require("../models/flujos.model");

let flujosOpciones = {}

flujosOpciones.verifyIfWorkflowExist = async (req, res, next) =>{
    const { nombre } = req.body;
    await Flujos.findOne({ nombre })
    .then(flujo =>{
      if(flujo) {
        res.status(400).send("Este flujo ya existe, intente con otro nombre.");
        return;
      }
      next();
    })
    .catch(err => {
         res.status(500).send("Hubo un error contacte al administrador.")
         return;
    });
};

flujosOpciones.verifyRequiredFields = (req, res, next) => {
  const { nombre, tiempo_resolucion } = req.body;
  hasRequestAllRequiredFields = nombre && tiempo_resolucion
  if (!hasRequestAllRequiredFields) {
      res.status(400).send("Todos los campos son requeridos.");
      return;
    }
  next();
};

module.exports = flujosOpciones