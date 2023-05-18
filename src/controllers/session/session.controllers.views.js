import jwt from 'jsonwebtoken'

import config from '../../config/config.js'

export const HandleRenderSignIn = (req, res) => {
  req.logger.debug('Render sign in')
  res.render('session/signin', { title: 'Sign In' })
}
export const HandleRenderSignUp = (req, res) => {
  req.logger.debug('Render sign up')
  res.render('session/signup', { title: 'Sign Up' })
}
export const HandleRenderResetPass = async (req, res) => {
  req.logger.debug('Render reset password')
  res.render('session/reset-pass', { title: 'Reset Your Password' })
}
export const HandleRenderResetPassSuccess = async (req, res, next) => {
  try {
    const { token } = req.params
    jwt.verify(token, config.authConfig.jwtSessionSecret)
    req.logger.debug('Render reset password success')
    res.render('session/reset-pass-success', { title: 'Reset Password' })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      req.logger.debug('Render reset password expired')
      return res.redirect('/reset-pass')
    }
    next(error)
  }
}
