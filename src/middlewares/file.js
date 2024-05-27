const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const createStorage = (folderName, fieldName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webP']
    }
  })
}

const upload = (storage, fieldName) => {
  return multer({ storage }).single(fieldName)
}

const uploadEvento = upload(
  createStorage('carteles-eventos', 'cartel'),
  'cartel'
)
const uploadPerfil = upload(createStorage('imagenes-perfil', 'img'), 'img')

module.exports = { uploadEvento, uploadPerfil }
