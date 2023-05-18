import nodemailer from 'nodemailer'

import config from '../config/config.js'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: true,
  auth: {
    user: 'aldairgome97@gmail.com',
    pass: config.authConfig.passNodemailer
  }
})

export const sendMail = async ({ email, subject, text, html }) => {
  await transporter.sendMail({
    from: 'BACKEND',
    to: email,
    subject: subject || 'BACKEND - CODERHOUSE 👻',
    text,
    html
  })
}
