const Asistente = require('../models/asistente')
const Evento = require('../models/evento')
const Usuario = require('../models/usuario')
const { updateEvento } = require('./evento')

const getAsistentes = async (req, res, next) => {
  try {
    const asistentes = await Asistente.find().populate('asistencia')
    return res.status(200).json(asistentes)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}
const getAsistenteById = async (req, res, next) => {
  try {
    const { id } = req.params
    const asistente = await Asistente.findById(id)
    return res.status(200).json(asistente)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}

const registroAsistencia = async (req, res, next) => {
  try {
    const { nombre, email } = req.body
    const { eventoId } = req.params

    const asistenteExistente = await Asistente.findOne({
      email,
      asistencia: eventoId
    })

    if (asistenteExistente) {
      return res.status(400).json({
        mensaje: 'El usuario ya está registrado como asistente para este evento'
      })
    }

    let nuevoAsistente

    try {
      nuevoAsistente = new Asistente({ nombre, email, asistencia: eventoId })
      await nuevoAsistente.save()
      if (req.usuario) {
        await Usuario.findByIdAndUpdate(req.usuario._id, {
          $push: { eventosAsistencia: nuevoAsistente._id }
        })
      }
      await Evento.findByIdAndUpdate(eventoId, {
        $push: { asistentes: nuevoAsistente._id }
      })
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json({ mensaje: 'Error al confirmar la asistencia' })
    }

    return res
      .status(200)
      .json({ mensaje: 'Asistencia confirmada con éxito', nuevoAsistente })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensaje: 'Error al confirmar la asistencia' })
  }
}

module.exports = { getAsistentes, getAsistenteById, registroAsistencia }