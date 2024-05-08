const nodeMailer = require('nodemailer')

const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'c3735861@gmail.com',
    pass: 'mbqmwgignvfxklgj'
  }
})

module.exports = transporter
let mail = {
  from: 'c3735861@gmail.com',
  to: 'example@mail.com',
  subject: 'Subject',
  text: 'Text',
  html: `
        <h5>Hi, this is a new Email from Nodemailer.</h5>
    `
}

transporter.sendMail(mail, (error, info) => {
  if (error) {
    console.error('Error sending email: ', error)
  } //end if
  else {
    console.log('Email sent.')
  } //end else
})
