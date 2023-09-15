const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const departamentos = new mongoose.Schema(
    {
      nombreDepartamento    : {type: String, defualt: null, unique: true},
      descripcion           : {type: String, default: null, required: true},
      modificador_id        : {type: ObjectId, defualt: null},
      creador_id            : {type: ObjectId, defualt: null},
      esta_eliminado        : {type: Boolean, default: false}
    },
    {
      timestamps: 
        {
          createdAt: "creado_a",
          updatedAt: "actualizado_a"
        }
    }
  );
  
  module.exports = mongoose.model("departamentos", departamentos);