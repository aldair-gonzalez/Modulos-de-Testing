import morgan from 'morgan'
import { logger } from '../utils/logger.js'
import { mode } from '../config/command.config.js'

const stream = { write: (message) => logger.http(message) }
const skip = () => mode === 'PRODUCTION'
export const useMorgan = morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream, skip }
)
