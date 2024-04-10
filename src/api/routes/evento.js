const { isAuth, isCreator } = require('../../middlewares/auth')
const { uploadEvento } = require('../../middlewares/file')
const {
  getEventos,
  getEventoById,
  updateEvento,
  deleteEvento
} = require('../controllers/evento')

const eventoRouter = require('express').Router()

eventoRouter.get('/', getEventos)
eventoRouter.get('/:id', getEventoById)
eventoRouter.patch(
  '/:id/auth/:userId',
  isAuth,
  isCreator,
  uploadEvento,
  updateEvento
)
eventoRouter.delete('/:id', isAuth, isCreator, deleteEvento)

module.exports = { eventoRouter }
