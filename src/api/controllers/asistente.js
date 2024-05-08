const transporter = require('../../middlewares/nodemailer')
const Asistente = require('../models/asistente')
const Evento = require('../models/evento')
const Usuario = require('../models/usuario')

const getAsistentes = async (req, res, next) => {
  try {
    const asistentes = await Asistente.find().populate('asistencia')
    return res.status(200).json(asistentes)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}

const getAsistenteById = async (req, res, next) => {
  try {
    const { id } = req.params
    const asistente = await Asistente.findById(id)
    return res.status(200).json(asistente)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error al hacer el get de los eventos')
  }
}

const registroAsistencia = async (req, res, next) => {
  try {
    const { nombre, email } = req.body
    const { eventoId } = req.params

    const asistenteExistente = await Asistente.findOne({
      email,
      asistencia: eventoId
    })

    if (asistenteExistente) {
      return res.status(400).json({
        mensaje: 'El usuario ya está registrado como asistente para este evento'
      })
    }

    let nuevoAsistente

    try {
      nuevoAsistente = new Asistente({ nombre, email, asistencia: eventoId })
      await nuevoAsistente.save()

      await Evento.findByIdAndUpdate(eventoId, {
        $push: { asistentes: nuevoAsistente._id }
      })

      let mail = {
        from: 'c3735861@gmail.com',
        to: email,
        subject: 'Confirmación de registro al evento',
        text: `Hola ${nombre}, Gracias por registrarte para el evento.`,
        html: `
              <h5>Hola ${nombre},</h5>
              <p>¡Gracias por unirte a nosotros para este emocionante evento! Estamos entusiasmados de tenerte con nosotros.</p>
              <p>¡Prepárate para una jornada llena de diversión, aprendizaje y nuevas conexiones!</p>
              <p>¡Esperamos verte pronto!</p>
              <p>¡Saludos!</p>
              <p>Clara</p>
          `
      }

      transporter.sendMail(mail, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo electrónico: ', error)
        } else {
          console.log('Correo electrónico enviado.')
        }
      })

      if (req.usuario) {
        await Evento.findByIdAndUpdate(eventoId, {
          $push: { asistentes: req.usuario._id }
        })
      }
      if (req.usuario) {
        await Usuario.findByIdAndUpdate(req.usuario._id, {
          $push: { eventosAsistencia: eventoId }
        })
      }
    } catch (error) {
      console.error(error)
      return res
        .status(500)
        .json({ mensaje: 'Error al confirmar la asistencia' })
    }
    return res
      .status(200)
      .json({ mensaje: 'Asistencia confirmada con éxito', nuevoAsistente })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ mensaje: 'Error al confirmar la asistencia' })
  }
}
// const registroAsistencia = async (req, res, next) => {
//   try {
//     const { nombre, email } = req.body
//     const { eventoId } = req.params

//     const asistenteExistente = await Asistente.findOne({
//       email,
//       asistencia: eventoId
//     })

//     if (asistenteExistente) {
//       return res.status(400).json({
//         mensaje: 'El usuario ya está registrado como asistente para este evento'
//       })
//     }

//     let nuevoAsistente

//     try {
//       nuevoAsistente = new Asistente({ nombre, email, asistencia: eventoId })
//       await nuevoAsistente.save()

//       await Evento.findByIdAndUpdate(eventoId, {
//         $push: { asistentes: nuevoAsistente._id }
//       })

//       if (req.usuario) {
//         await Evento.findByIdAndUpdate(eventoId, {
//           $push: { asistentes: req.usuario._id }
//         })
//       }
//       if (req.usuario) {
//         await Usuario.findByIdAndUpdate(req.usuario._id, {
//           $push: { eventosAsistencia: eventoId }
//         })
//       }
//     } catch (error) {
//       console.error(error)
//       return res
//         .status(500)
//         .json({ mensaje: 'Error al confirmar la asistencia' })
//     }
//     return res
//       .status(200)
//       .json({ mensaje: 'Asistencia confirmada con éxito', nuevoAsistente })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ mensaje: 'Error al confirmar la asistencia' })
//   }
// }

module.exports = { getAsistentes, getAsistenteById, registroAsistencia }
