const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ticketPrioridades = new mongoose.Schema(
  {
    nombre          : {type: String, defualt: null},
    color           : {type: String, defualt: null},
    modificador_id  : {type: ObjectId, default: null},
    esta_eliminado  : {type: Boolean, default: false},
    creador_id      : {type: ObjectId, default: null}
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

module.exports = mongoose.model("ticket_prioridade", ticketPrioridades);