const deleteImgCloudinary = require('../../utils/deleteFile')
const { generarLlave } = require('../../utils/jwt')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const { transporter } = require('../../utils/nodemailer')
const Evento = require('../models/evento')
const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find().populate('eventosOrganizados')
    return res.status(200).json(usuarios)
  } catch (error) {
    return res.status(400).json('error al hacer get de los usuarios')
  }
}

const getUsuariosbyId = async (req, res, next) => {
  try {
    const { id } = req.params
    const usuario = await Usuario.findById(id)
    return res.status(200).json(usuario)
  } catch (error) {
    return res.status(400).json('error al hacer get por ID de los usuarios')
  }
}

const register = async (req, res, next) => {
  try {
    const usuarioDuplicado = await Usuario.findOne({
      nombreUsuario: req.body.nombreUsuario
    })
    if (usuarioDuplicado) {
      return res.status(400).json('Usuario ya existente')
    }

    const newUsuario = new Usuario({
      nombreUsuario: req.body.nombreUsuario,
      password: req.body.password,
      email: req.body.email,
      rol: 'user'
    })
    if (req.file) {
      newUsuario.img = req.file.path
    }

    const usuario = await newUsuario.save()
    return res.status(201).json(usuario)
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error al hacer post de los usuarios')
  }
}

const login = async (req, res, next) => {
  try {
    const { nombreUsuario, password } = req.body

    if (!nombreUsuario || typeof nombreUsuario !== 'string') {
      return res.status(400).json({ error: 'Nombre de usuario no válido' })
    }
    const usuario = await Usuario.findOne({ nombreUsuario })

    if (!usuario) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    const contraseñaValida = bcrypt.compareSync(password, usuario.password)

    if (!contraseñaValida) {
      return res.status(400).json({ error: 'Contraseña incorrecta' })
    }

    const token = generarLlave(usuario._id)
    return res.status(200).json({ token, usuario })
  } catch (error) {
    console.error('Error en el login:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const updateUsuarios = async (req, res, next) => {
  try {
    const { id } = req.params

    const antiguoUsuario = await Usuario.findById(id)
    console.log(antiguoUsuario)
    if (!antiguoUsuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const camposActualizados = {}

    if (req.body.nombreUsuario) {
      camposActualizados.nombreUsuario = req.body.nombreUsuario
    }

    if (req.body.email) {
      camposActualizados.email = req.body.email
    }

    if (req.body.password) {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10)
      camposActualizados.password = hashedPassword
    }

    if (req.file) {
      if (antiguoUsuario.img) {
        deleteImgCloudinary(antiguoUsuario.img)
      }
      camposActualizados.img = req.file.path
    }

    const usuarioUpdated = await Usuario.findByIdAndUpdate(
      id,
      camposActualizados,
      {
        new: true
      }
    )

    if (!usuarioUpdated) {
      return res
        .status(404)
        .json({ error: 'No se encontró ningún usuario para actualizar' })
    }

    return res.status(200).json(usuarioUpdated)
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: 'Error al actualizar el usuario' })
  }
}

module.exports = {
  getUsuarios,
  getUsuariosbyId,
  register,
  login,
  updateUsuarios
}
