import * as winston from 'winston'

import { mode } from '../config/command.config.js'

const customLevelOptions = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0
  },
  colors: {
    debug: 'white',
    http: 'cyan',
    info: 'blue',
    warning: 'yellow',
    error: 'magenta',
    fatal: 'red'
  }
}

const format = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY  HH:mm:ss' }),
  winston.format.colorize({ colors: customLevelOptions.colors }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
)
const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/errors.log',
    level: 'error'
  })
]

export const logger = winston.createLogger({
  level: mode !== 'PRODUCTION' ? 'debug' : 'info',
  levels: customLevelOptions.levels,
  format,
  transports
})

export const addLogger = (req, res, next) => {
  req.logger = logger
  next()
}
