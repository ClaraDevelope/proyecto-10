const { transporter } = require('./nodemailer')

const mailOptions = {
  from: 'c3735861@gmail.com',
  to: 'clara.manzano.corona@gmail.com',
  subject: 'Correo electrónico de prueba desde Nodemailer',
  text: 'Este es un correo electrónico de prueba enviado desde Nodemailer.'
}

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar el correo electrónico de prueba:', error)
  } else {
    console.log('Correo electrónico de prueba enviado:', info.response)
  }
})
