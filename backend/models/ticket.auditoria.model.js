const mongoose = require("mongoose");

const ticketAuditoria = new mongoose.Schema(
  {
    asunto    : {type: String, defualt: null},
    contenido : {type: String, defualt: null},
    user_id   : {type: Number, default: null},
    ticket_id : {type: Number, default: null}
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

module.exports = mongoose.model("ticket_auditoria", ticketAuditoria);