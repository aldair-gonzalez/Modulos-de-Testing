import jwt from 'jsonwebtoken'

import { userService } from '../../dao/services/user.service.js'
import { sendMail } from '../../utils/nodemailer.js'
import config from '../../config/config.js'

const expiresIn = 24 * 60 * 60 * 1000 // 1 day
// const expiresIn = 30 * 1000 // 30 seconds

export const HandleCurrent = async (req, res, next) => {
  req.logger.debug('session controller: current')
  res.send(req.user)
}

export const HandleGithub = async (req, res, next) => {
  const { _id, fullname, firstName, lastName, email, age, cart, role } = await req.user.payload
  const obj = { _id, fullname, firstName, lastName, email, age, cart, role }
  const token = jwt.sign(obj, config.authConfig.jwtSessionSecret)
  await res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: expiresIn
  })
  req.logger.debug('session controller: github')
  res.redirect('/products')
}

export const HandleSignIn = async (req, res, next) => {
  const token = jwt.sign(await req.user.payload, config.authConfig.jwtSessionSecret)
  await res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: expiresIn
  })

  req.logger.debug('session controller: sign in')
  res.redirect('/api/session/current')
}

export const HandleSignUp = async (req, res, next) => {
  const { _id, fullname, firstName, lastName, email, age, cart, role } = await req.user.payload
  const obj = { _id, fullname, firstName, lastName, email, age, cart, role }
  const token = jwt.sign(obj, config.authConfig.jwtSessionSecret)
  await res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: expiresIn
  })
  req.logger.debug('session controller: sign up')
  res.redirect('/api/session/current')
}

export const HandleLogout = async (req, res, next) => {
  req.logger.debug('session controller: logout')
  res.clearCookie('jwt')
  res.sendStatus(204)
}

export const HandleCreateTokenResetPass = async (req, res, next) => {
  try {
    const { email } = req.body
    const result = await userService.createTokenResetPass(email)
    res.render('emails/reset-pass', { token: result.payload }, async (err, html) => {
      if (err) req.logger.error(err)
      else {
        await sendMail({
          email,
          text: 'Reset Your Password',
          subject: 'Reset Your Password',
          html
        })
        console.log(req.originalUrl)
        res.status(result.status).send({ status: result.status, payload: 'Email sent' })
      }
    })
  } catch (error) {
    next(error)
  }
}

export const HandleUpdatePass = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body
    const result = await userService.updatePass(token, password)
    res.status(result.status).send(result)
  } catch (error) {
    next(error)
  }
}
