const mongoose = require("mongoose");

const flujo = new mongoose.Schema(
  {
    horaInicio              : {type: Number, defualt: null},
    horaFinal               : {type: Number, default: null},
    incluyeFinesDeSemana    : {type: Boolean }
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

module.exports = mongoose.model("horarioOperacion", flujo);