const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const createStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webP']
    }
  })
}

const upload = (storage) => {
  return multer({ storage }).single('file')
}

const uploadEvento = upload(createStorage('carteles-eventos'))
const uploadPerfil = upload(createStorage('imagenes-perfil'))

module.exports = { uploadEvento, uploadPerfil }
