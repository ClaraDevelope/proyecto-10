const mongoose = require('mongoose')

const asistenteSchema = new mongoose.Schema(
  {
    nombre: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    asistencia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'eventos'
    }
  },
  {
    timestamps: true,
    collection: 'asistentes'
  }
)

const Asistente = mongoose.model('asistentes', asistenteSchema, 'asistentes')
module.exports = Asistente
