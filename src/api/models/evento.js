const mongoose = require('mongoose')

const eventoSchema = new mongoose.Schema(
  {
    titulo: { type: String, trim: true, required: true },
    fecha: { type: Date, required: true },
    ubicacion: { type: String, trim: true, required: true },
    descripcion: { type: String, trim: true, required: false },
    precio: { type: Number, required: false },
    cartel: { type: String, trim: true, required: false },
    asistentes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'asistentes'
      }
    ],
    asistentesUsuarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios'
      }
    ],
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'usuarios'
    }
  },
  {
    timestamps: true,
    collection: 'eventos'
  }
)

const Evento = mongoose.model('eventos', eventoSchema, 'eventos')
module.exports = Evento
