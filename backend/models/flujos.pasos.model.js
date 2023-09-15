const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const flujoPasos = new mongoose.Schema(
  {
    nombre                    : {type: String, defualt: null, unique: true},
    orden                     : {type: Number, default: null},
    tiempo_de_respuesta_hrs   : {type: Number, default: null},
    flujo_id                  : {type: ObjectId, defualt: null},
    creador_id                : {type: ObjectId, defualt: null},
    modificador_id            : {type: ObjectId, default: null},
    esta_eliminado            : {type: Boolean, default: false}
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

module.exports = mongoose.model("flujo_pasos", flujoPasos);