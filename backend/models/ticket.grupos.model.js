const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ticketGrupo = new mongoose.Schema(
  {
    nombre          : {type: String, defualt: null, unique: true},
    color           : {type: String, defualt: null},
    creador_id      : {type: ObjectId, default: null},
    modificador_id  : {type: ObjectId, default: null},
    esta_eliminado  : {type: Boolean, default: false}
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

module.exports = mongoose.model("ticket_grupo", ticketGrupo);