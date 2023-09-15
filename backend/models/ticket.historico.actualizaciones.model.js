const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ticketHistoricoActualizaciones = new mongoose.Schema(
  {
    ticket_id             : {type: Number, ref: 'ticket'},
    departamento_id         : {type: ObjectId, ref: 'departamentos', default: null},
    creador_id            : {type: ObjectId, ref: 'usuario', default: null},
    compleado_a           : {type: Date, default: null},
    asignado_id           : {type: ObjectId, ref: 'usuario', default: null},
    esta_completado       : {type: Boolean, default: null},
    modificador_id        : {type: ObjectId, ref: 'usuario', default: null},
    esta_eliminado        : {type: Boolean, default: null}
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

module.exports = mongoose.model("ticket_historico_actualizaciones", ticketHistoricoActualizaciones);