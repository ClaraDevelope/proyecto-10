const Evento = require('../api/models/evento')
const Usuario = require('../api/models/usuario')
const { verificarLlave } = require('../utils/jwt')

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const parsedToken = token.replace('Bearer ', '')

    const { id } = verificarLlave(parsedToken)
    const usuario = await Usuario.findById(id)

    usuario.password = null
    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(400).json('No estás autorizado')
  }
}

const isCreator = async (req, res, next) => {
  try {
    const eventoId = req.params.id
    const userId = req.params.userId
    const evento = await Evento.findById(eventoId)
    try {
      if (!evento || evento.creador._id.toString() !== userId) {
        throw new Error('No eres el creador del evento')
      }
      next()
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: 'No puedes modificar el evento' })
  }
}

module.exports = { isAuth, isCreator }
