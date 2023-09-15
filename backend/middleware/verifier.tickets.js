const Prioridades = require("../models/ticket.prioridades.model");
const Categorias = require("../models/ticket.categorias.model");
const Flujos = require("../models/flujos.model");
const Estados = require("../models/ticket.estados.model");

let ticketOpciones = {}

ticketOpciones.verifyAllRequiredFieldsForTicketCreation = (req, res, next) => {
    const { asunto, categoria_id, contenido, prioridad_id, trabajo_flujo_id  } = req.body

    console.log(req.body);

    hasRequestAllRequiredFields = asunto && contenido && prioridad_id && categoria_id && trabajo_flujo_id
    if (!hasRequestAllRequiredFields) {
        res.status(400).send("Todos los campos son requeridos.");
        return;
        }
    next();
    };

ticketOpciones.verifyIfPriorityExist = async (req, res, next) =>{
    const { prioridad_id } = req.body;
    await Prioridades.findOne({ _id: prioridad_id })
    .then(() =>{
      next();
    })
    .catch(() => {
         res.status(500).send("La prioridad no existe.");
         return;
    });
};

ticketOpciones.verifyIfCategoryExist = async (req, res, next) =>{
    const { categoria_id } = req.body;
    await Categorias.findOne({ _id: categoria_id })
    .then(() =>{
      next();
    })
    .catch(() => {
         res.status(500).send("La categoria no existe.");
         return;
    });
};    

ticketOpciones.verifyIfWorkflowExist = async (req, res, next) =>{
    const { trabajo_flujo_id } = req.body;
    await Flujos.findOne({ _id: trabajo_flujo_id })
    .then(() =>{
      next();
    })
    .catch(() => {
         res.status(500).send("El flujo de trabajo no existe.");
         return;
    });
};

ticketOpciones.verifyIfStatusExist = async (req, res, next) =>{
    const { estado_id } = req.body;
    await Estados.findOne({ _id: estado_id })
    .then(() =>{
      next();
    })
    .catch(() => {
         res.status(500).send("El flujo de trabajo no existe.");
         return;
    });
};  

module.exports = ticketOpciones