const deleteImgCloudinary = require('../../utils/deleteFile')
const { generarLlave } = require('../../utils/jwt')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
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
    const usuario = await Usuario.findOne({ nombreUsuario })
    if (!usuario) {
      return res.status(400).json({ error: 'no etá' })
    }
    if (bcrypt.compareSync(password, usuario.password)) {
      const token = generarLlave(usuario._id)
      return res.status(200).json({ token, usuario })
    } else {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' })
    }
  } catch (error) {
    console.error('Error en el login:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

const updateUsuarios = async (req, res, next) => {
  try {
    const { id } = req.params

    const antiguoUsuario = await Usuario.findById(id)
    if (!antiguoUsuario) {
      return res.status(404).json('Usuario no encontrado')
    }

    const newUsuarioData = { ...req.body, _id: id }

    // Si hay una nueva imagen en la petición, eliminar la imagen antigua
    if (req.file) {
      if (antiguoUsuario.img) {
        deleteImgCloudinary(antiguoUsuario.img)
      }
      newUsuarioData.img = req.file.path
    }

    const usuarioUpdated = await Usuario.findByIdAndUpdate(id, newUsuarioData, {
      new: true
    })

    if (!usuarioUpdated) {
      return res
        .status(404)
        .json('No se encontró ningún usuario para actualizar')
    }

    return res.status(200).json(usuarioUpdated)
  } catch (error) {
    console.error(error)
    return res.status(400).json('Error al hacer update de los usuarios')
  }
}

const checkSession = async (req, res, next) => {
  console.log('entró')
  return res.status(200).json(req.usuario)
}

module.exports = {
  getUsuarios,
  getUsuariosbyId,
  register,
  login,
  updateUsuarios,
  checkSession
}
