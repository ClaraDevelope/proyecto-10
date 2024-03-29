const Evento = require('../api/models/evento')
const Usuario = require('../api/models/usuario')
const { verificarLlave } = require('../utils/jwt')

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const parsedToken = token.replace('Bearer ', '')

    const { id } = verificarLlave(parsedToken)
    const usuario = await Usuario.findById(id)

    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    req.usuario = usuario
    next()
  } catch (error) {
    return res.status(400).json('No estás autorizado')
  }
}

const isAuth = async (req, res, next) => {
  try {
    await verificarToken(req, res, next)
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: 'No estás autorizado' })
  }
}

const isCreator = async (req, res, next) => {
  try {
    await verificarToken(req, res, async () => {
      const usuario = req.usuario
      const eventoId = req.params.id
      const evento = await Evento.findById(eventoId)

      if (!evento || evento.creador.toString() !== usuario._id.toString()) {
        throw new Error('No eres el creador del evento')
      }

      next()
    })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: error.message })
  }
}

module.exports = { isAuth, isCreator }
