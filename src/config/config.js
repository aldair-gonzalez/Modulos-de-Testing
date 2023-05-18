import { config as dotenvConfig } from 'dotenv'
import { mode } from './command.config.js'

import defaultConfig from './default.config.js'
import developmentConfig from './development.config.js'
import productionConfig from './production.config.js'
import authConfig from './auth.config.js'
import mongooseConfig from './mongoose.config.js'

export function loadEnv () {
  dotenvConfig({
    path: mode !== 'PRODUCTION' ? '.env.development' : '.env.production'
  })
}

loadEnv()

export default {
  ...defaultConfig,
  ...(mode === 'production' ? productionConfig : developmentConfig),
  authConfig,
  mongooseConfig
}
