const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const eventoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'carteles-eventos',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webP']
  }
})

const perfilStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'imagenes-perfil',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webP']
  }
})

const uploadEvento = multer({ storage: eventoStorage }).single('cartel')
const uploadPerfil = multer({ storage: perfilStorage }).single('img')

module.exports = { uploadEvento, uploadPerfil }
