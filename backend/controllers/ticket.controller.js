const Ticket = require("../models/ticket.model");
const Flujo = require("../models/flujos.model");
const Historico = require("../models/ticket.historico.actualizaciones.model");
const Estados = require('../models/ticket.estados.model');

debugger;
exports.crearTicket = async (req, res) => {
    const currentUserId = req.user.user_id;
    const { asunto, contenido, prioridad_id, categoria_id } = req.body
    const { trabajo_flujo_id } = req.body;

    const estadoPorDefecto = await Estados.findOne({usado_por_defecto: true}).lean().exec();

    const ticket = new Ticket({
      asunto: asunto,
      contenido: contenido,
      estado_id: estadoPorDefecto._id,
      prioridad_id: prioridad_id,
      categoria_id: categoria_id,
      trabajo_flujo_id: trabajo_flujo_id,
      creador_id      : currentUserId,
      modificador_id  : null,
      esta_eliminado  : false
  });

  const flujo = await Flujo.findOne({_id: trabajo_flujo_id}).lean().exec();

  ticket.save(async (err)=>{
    console.log(err);
    if(err) return res.status(500).send({message: "Hubo un error, no se pudo crear el ticket."});
    await Historico.create({
      ticket_id: ticket._id,
      departamento_id: flujo.departamento,
      creador_id: currentUserId,
      asignado_id: null,
      esta_completado: false,
      modificador_id: null,
      esta_eliminado: false
    })
    .catch(err=>{
      res.status(500).send({message: "Hubo un error, no se pudo crear el ticket y su historico."})
    });
    res.status(201).send({message: "Se ha creado el ticket!"})
  })
  };

exports.obtenerTickets = async (req, res) => {
    Ticket.find({esta_eliminado: false})
          .populate('estado_id')
          .populate('prioridad_id')
          .populate('categoria_id')
          .populate('creador_id')
          .populate('modificador_id')
          .populate('trabajo_flujo_id')
          .exec((err, docs)=>{
            if (err) return res.status(400).send("Hubo un error."); 
            return res.status(200).send(docs);
        });
};

exports.getTicketsByUser = async (req, res) => {
    Ticket.find({creador_id: req.user.user_id, esta_eliminado: false})
          .populate('estado_id')
          .populate('prioridad_id')
          .populate('categoria_id')
          .populate('creador_id')
          .populate('modificador_id')
          .populate('trabajo_flujo_id')
          .exec((err, docs)=>{
                if (err) return res.status(400).send("Hubo un error."); 
                return res.status(200).send(docs);
            });
};

exports.obtenerTicketPorId = async (req, res) => {
  const id = req.params.id;
  try {
    const ticket = await Ticket.findById(id)
      .populate('estado_id')
      .populate('prioridad_id')
      .populate('categoria_id')
      .populate('creador_id')
      .populate('modificador_id')
      .populate('trabajo_flujo_id');

    res.json(ticket);
  } catch (err) {
    res.status(400).send({ message: 'No se pudo obtener el ticket.' });
  }
};

exports.actualizarTicket = async (req, res) => {
  
  const { asunto, contenido, estado_id, prioridad_id, categoria_id } = req.body;

  console.log(req.body);
  
  let update = {
    ...( asunto         && { asunto         }),
    ...( contenido      && { contenido      }),
    ...( estado_id      && { estado_id      }),
    ...( prioridad_id   && { prioridad_id   }),
    ...( categoria_id   && { categoria_id   })
  }

  const modificador = req.user.user_id;
  update.modificador_id = modificador;

  const filter  = {_id: req.params.id};

  await Ticket.findOneAndUpdate(
      filter, update, {
      new: true
  }).then(doc => {
      res.status(200).send({message: "Se modificaron los registros exitosamente."});
  }).catch(err => {
      res.status(400).send("No se pudo modificar el documento.")
  })
}

exports.cambiarDisponibilidadDeUnTicket = async (req, res) => {
  const id = req.params.id;
  const filtroTicket  = { _id: id };

  const filtroPasos = { ticket_id: { $eq: id } }
  const modificador = req.user.user_id;

  const method = req.method;
  const isDeleted = method == 'DELETE';
  const esta_eliminado = isDeleted ? true : false

  const update = {
      modificador_id: modificador,
      esta_eliminado: esta_eliminado
  }
  try{
      let ticket = await Ticket.findOneAndUpdate(filtroTicket, update, {
          new: true
      });

      let pasos = await Pasos.updateMany(filtroPasos, update, {
        new: true
    });

      res.status(200).send({
          message: "Se desactivo el ticket de manera exitosa y los pasos relacionados a el.",
          ticket: ticket,
          pasos: pasos
      });
  } catch(err){
      res.status(400).send({message: "Hubo un error no se pudo modificar el documento."})
  }
}