const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    nombres         : { type: String, default: null },
    apellidos       : { type: String, default: null },
    email           : { type: String, unique: true },
    telefono        : { type: String, default: '', unique: true},
    password        : { type: String, default: null },
    es_administrador: { type: Boolean, default: false },
    es_usuario      : { type: Boolean, default: true },
    esta_activo     : { type: Boolean, default: true },
    foto_perfil     : { type: String, default: true }
  },
  {
    timestamps: {
      createdAt: "creado_a",
      updatedAt: "actualizado_a"
    }
  }
);

module.exports = mongoose.model("usuario", usuarioSchema);
