import jwt from 'jsonwebtoken'
import config from '../config/config.js'

import { userService } from '../dao/services/user.service.js'

const validateSession = async (req, res, next, path) => {
  try {
    if (!req.cookies.jwt) {
      req.session = null
      req.logger.debug('There is no active session')
      return res.redirect(`${path}`)
    }
    const session = jwt.verify(req.cookies.jwt, config.authConfig.jwtSessionSecret)
    const { email } = session
    const result = await userService.getOne(email)
    if (result.status === 404) {
      req.logger.warning('Session exist but user does not exist')
      req.logger.debug('Session exist but user does not exist')
      req.session = null
      return res.redirect(`${path}`)
    }
    req.logger.debug('Session is valid')
    return next()
  } catch (error) {
    next(error)
  }
}

const validateUser = async (req, res, next, role) => {
  try {
    const session = jwt.verify(req.cookies.jwt, config.authConfig.jwtSessionSecret)
    if (session.role !== role) throw new Error('User is not authorized')
    next()
  } catch (error) {
    next(error)
  }
}
const validateUserRoles = async (req, res, next, roles) => {
  try {
    const session = jwt.verify(req.cookies.jwt, config.authConfig.jwtSessionSecret)
    if (!roles.includes(session.role)) throw new Error('User is not authorized')
    next()
  } catch (error) {
    next(error)
  }
}

const existSession = async (req, res, next, path) => {
  try {
    if (req.cookies.jwt) {
      const session = jwt.verify(req.cookies.jwt, config.authConfig.jwtSessionSecret)
      const { email } = session
      const result = await userService.getOne(email)
      if (result.status === 404) {
        req.logger.warning('Session exist but user does not exist')
        res.clearCookie('jwt')
      }
      if (result.status === 200) {
        req.logger.debug('Session exists and user exists')
        return res.redirect(`${path}`)
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const requireApiSession = async (req, res, next) => await validateSession(req, res, next, '/error')
export const requireViewSession = async (req, res, next) => await validateSession(req, res, next, '/signin')

export const requireAuthRoleAdmin = async (req, res, next) => await validateUser(req, res, next, 'admin')
// export const requireAuthRoleUser = async (req, res, next) => await validateUser(req, res, next, 'usuario')
export const requireAuthRoleAdminOrPremium = async (req, res, next) => await validateUserRoles(req, res, next, ['admin', 'premium'])
export const requireAuthRoleUserOrPremium = async (req, res, next) => await validateUserRoles(req, res, next, ['usuario', 'premium'])

export const requireExistSession = async (req, res, next) => await existSession(req, res, next, '/products')
