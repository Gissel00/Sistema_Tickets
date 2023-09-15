const Pasos = require("../models/flujos.pasos.model");
const Flujos = require("../models/flujos.model");
let pasosOpciones = {}

pasosOpciones.verifyIfWorkflowStepExist = async (req, res, next) =>{
    const { nombre } = req.body;
    await Pasos.findOne({ nombre })
    .then(paso =>{
      if(paso) {
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

pasosOpciones.verifyIfWorkflowExist = async (req, res, next) =>{
    const { flujo_id } = req.body;
    await Flujos.findOne({ _id: flujo_id })
    .then(() =>{
      next();
    })
    .catch(() => {
         res.status(500).send("El flujo de trabajo no existe.");
         return;
    });
};

pasosOpciones.verifyRequiredFields = async (req, res, next) => {
  const { nombre, flujo_id, orden, tiempo_de_respuesta_hrs } = req.body;
  hasRequestAllRequiredFields = nombre && orden && flujo_id && tiempo_de_respuesta_hrs
    if (!hasRequestAllRequiredFields) {
      res.status(400).send("Todos los campos son requeridos.");
      return;
    }
  next();
};

module.exports = pasosOpciones