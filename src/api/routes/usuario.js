const { isAuth } = require('../../middlewares/auth')
const { uploadPerfil, uploadEvento } = require('../../middlewares/file')
const { registroAsistencia } = require('../controllers/asistente')
const { postEvento } = require('../controllers/evento')
const {
  getUsuarios,
  register,
  login,
  updateUsuarios,
  getUsuariosbyId,
  checkSession
} = require('../controllers/usuario')

const userRouter = require('express').Router()
userRouter.get('/checkSession', isAuth, checkSession)
userRouter.get('/', isAuth, getUsuarios)
userRouter.get('/:id', isAuth, getUsuariosbyId)
userRouter.post('/:id/create', isAuth, uploadEvento, postEvento)
userRouter.post('/register', uploadPerfil, register)
userRouter.post('/login', login)
userRouter.put('/:id', isAuth, uploadPerfil, updateUsuarios)
userRouter.post('/eventos/:eventoId/confirmar', isAuth, registroAsistencia)

module.exports = { userRouter }
