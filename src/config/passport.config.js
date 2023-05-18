import passport from 'passport'
import Local from 'passport-local'
import Jwt, { ExtractJwt } from 'passport-jwt'
import Github2 from 'passport-github2'

import { userService } from '../dao/services/user.service.js'
import { response } from '../utils/response.js'
import config from './config.js'

const LocalStrategy = Local.Strategy
const JwtStrategy = Jwt.Strategy
const GithubStrategy = Github2.Strategy

export const initPassport = () => {
  passport.use('github', new GithubStrategy({
    clientID: config.authConfig.github.clientId,
    clientSecret: config.authConfig.github.clientSecret,
    callbackURL: config.authConfig.github.callbackUrl
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userService.getOne(profile._json.email)

      if (user.status === 404) {
        const newUser = {
          firstName: profile._json.name,
          lastName: '',
          email: profile._json.email,
          password: null
        }
        const result = await userService.create(newUser)

        return done(null, result)
      }
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }))

  passport.use('signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const result = await userService.signin(email, password)
      if (result.status !== 200) return done(null, false, result)
      return done(null, result)
    } catch (error) {
      return done(error)
    }
  }))

  passport.use('signup', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, email, password, done) => {
    try {
      const { firstName, lastName, age, role } = req.body
      const obj = { firstName, lastName, email, age, password, role }
      const result = await userService.create(obj)
      if (result.status !== 201) return done(null, false, result)

      return done(null, result)
    } catch (error) {
      return done(error)
    }
  }))

  passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: config.authConfig.jwtSessionSecret
  }, (jwtPayload, done) => {
    try {
      if (!jwtPayload) return done(null, false, response(400, null, jwtPayload))
      const obj = response(200, jwtPayload)
      return done(null, obj)
    } catch (error) {
      return done(error)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
  })
}

const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) {
    token = req.cookies.jwt
    req.logger.debug('Token found')
  } else {
    req.logger.debug('No token found')
  }
  return token
}
