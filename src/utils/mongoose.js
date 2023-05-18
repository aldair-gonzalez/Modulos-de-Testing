import { connect } from 'mongoose'

import config from '../config/config.js'

export const connectMongo = async () => await connect(config.mongooseConfig.url, { dbName: config.mongooseConfig.dbName })
