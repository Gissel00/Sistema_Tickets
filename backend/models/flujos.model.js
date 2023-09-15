const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const flujo = new mongoose.Schema(
  {
    nombre              : {type: String, defualt: null, unique: true},
    tiempo_resolucion   : {type: String, default: null, required: true},
    departamento        : {type: ObjectId, ref: 'departamentos', require: true},
    modificador_id      : {type: ObjectId, defualt: null},
    creador_id          : {type: ObjectId, defualt: null},
    esta_eliminado      : {type: Boolean, default: false}
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

module.exports = mongoose.model("flujo", flujo);