import app from './app.js'

import config from './config/config.js'
import { logger } from './utils/logger.js'

const server = app.listen(config.serverPort, () => {
  logger.info(`Server listening on http://localhost:${config.serverPort}`)
})
server.on('error', (err) => logger.error(err))
