const Pasos = require("../models/flujos.pasos.model");
const User = require("../models/usuario.model");
const Ticket = require("../models/ticket.model");

let comentariosOpciones = {}

comentariosOpciones.verifyIfUserExist = async (req, res, next) =>{
    const { user_id } = req.body;
    await User.findOne({ _id: user_id })
    .then(() =>{
      next();
    })
    .catch(() => {
         res.status(500).send(`El usuario con id: ${user_id} no existe.`);
         return;
    });
};
comentariosOpciones.verifyIfTicketExist = async (req, res, next) =>{
    const { ticket_id } = req.body;
    await User.findOne({ _id: ticket_id })
    .then(() =>{
      next();
    })
    .catch(() => {
         res.status(500).send(`El ticket id: ${ticket_id} no existe.`);
         return;
    });
};

comentariosOpciones.verifyRequiredFields = async (req, res, next) => {
  const { asunto, contenido, user_id, ticket_id } = req.body;
  hasRequestAllRequiredFields = asunto && contenido && user_id && ticket_id
    if (!hasRequestAllRequiredFields) {
      res.status(400).send("Todos los campos son requeridos.");
      return;
    }
  next();
};

module.exports = comentariosOpciones