const deleteImgCloudinary = require('../../utils/deleteFile')
const Evento = require('../models/evento')
const Usuario = require('../models/usuario')

const getEventos = async (req, res, next) => {
  try {
    const eventos = await Evento.find()
      .populate([{ path: 'asistentes' }, { path: 'creador' }])
      .sort({ fecha: 1 })
    return res.status(200).json(eventos)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}
const getEventoById = async (req, res, next) => {
  try {
    const { id } = req.params
    const evento = await Evento.findById(id)
    return res.status(200).json(evento)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}

const postEvento = async (req, res, next) => {
  try {
    const userId = req.params.id
    const newEvento = new Evento(req.body)
    newEvento.creador = userId
    if (req.file) {
      newEvento.cartel = req.file.path
    }
    const evento = await newEvento.save()

    await Usuario.findByIdAndUpdate(userId, {
      $push: {
        eventosOrganizados: evento._id,
        creador: userId
      }
    })
    await evento.save()

    return res.status(201).json({ evento })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: 'No se ha podido crear el evento' })
  }
}

const updateEvento = async (req, res, next) => {
  try {
    const { id } = req.params
    const antiguoEvento = await Evento.findById(id)
    if (!antiguoEvento) {
      return res
        .status(404)
        .json({ error: 'No se encontró el evento para actualizar' })
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(id, req.body, {
      new: true
    })
    if (!eventoActualizado) {
      return res
        .status(404)
        .json({ error: 'No se encontró el evento para actualizar' })
        .json({ error: 'No se encontró el evento actualizado' })
    }
    if (req.file) {
      if (antiguoEvento.cartel) {
        deleteImgCloudinary(antiguoEvento.cartel)
      }

      eventoActualizado.cartel = req.file.path
      await eventoActualizado.save()
    }
    return res.status(200).json(eventoActualizado)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al actualizar el evento' })
  }
}

const deleteEvento = async (req, res, next) => {
  try {
    const { id } = req.params
    const evento = await Evento.findByIdAndDelete(id)
    if (evento.cartel) {
      deleteImgCloudinary(evento.cartel)
    }
    return res
      .status(200)
      .json({ message: 'ha sido eliminado con éxito', evento })
  } catch (error) {
    return res.status(400).json('Error al eliminar el evento')
  }
}

module.exports = {
  getEventos,
  getEventoById,
  postEvento,
  updateEvento,
  deleteEvento
}
