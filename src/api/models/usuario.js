const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const usuarioSchema = new mongoose.Schema(
  {
    nombreUsuario: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    img: { type: String, trim: true, required: false },
    eventosAsistencia: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventos',
        required: false
      }
    ],
    eventosOrganizados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eventos',
        required: false
      }
    ],
    rol: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'usuarios'
  }
)

usuarioSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10)
})

const Usuario = mongoose.model('usuarios', usuarioSchema, 'usuarios')
module.exports = Usuario
