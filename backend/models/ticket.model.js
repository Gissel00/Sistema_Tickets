const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const ticketSchema = new mongoose.Schema(
  {
    _id             : { type: Number, required: true, unique: true, default: 1 },
    asunto          : { type: String, default: null },
    contenido       : { type: String, default: null },
    estado_id       : { type: ObjectId, ref: 'ticket_estados' },
    prioridad_id    : { type: ObjectId, ref: 'ticket_prioridade' },
    creador_id      : { type: ObjectId, ref: 'usuario' },
    categoria_id    : { type: ObjectId, ref: 'ticket_categoria' },
    trabajo_flujo_id: { type: ObjectId, ref: 'flujo' },
    modificador_id  : { type: ObjectId, ref: 'usuario' },
    esta_eliminado  : { type: Boolean, default: false}
  },
  {
    timestamps: 
      {
        createdAt: "creado_a",
        updatedAt: "actualizado_a"
      }
  }
);

ticketSchema.pre('save', function(next) {
  const doc = this;
  doc.constructor.countDocuments({}, (err, count) => {
    if (err) return next(err);
    doc._id = count + 1;
    next();
  });
});

module.exports = mongoose.model("ticket", ticketSchema);