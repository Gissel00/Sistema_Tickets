const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ticketComentario = new mongoose.Schema(
  {
    asunto            : {type: String, default: null},
    contenido         : {type: String, default: null},
    creador        : {type: ObjectId, ref: 'usuario'},
    ticket         : {type: Number, ref: 'ticket'},
    modificador_id    : {type: ObjectId,default: null},
    esta_eliminado    : {type: Boolean, default: false}
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

module.exports = mongoose.model("ticket_comentario", ticketComentario);