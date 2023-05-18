import { loadEnv } from './config.js'
import { port, store } from './command.config.js'
import mongooseConfig from './mongoose.config.js'

loadEnv()

export default {
  serverPort: port || process.env.SERVER_PORT || 80,
  store: store || process.env.STORE || 'MONGO',
  mongooseConfig
}
