import config from '../../config/config.js'
import { connectMongo } from '../../utils/mongoose.js'
import { UserRepository } from './repository/user.repository.js'

let UserService

switch (config.store) {
  case 'MONGO': {
    connectMongo()
    const { userMongo } = await import('../mongo/user.mongo.js')
    UserService = userMongo
    break
  }

  case 'MEMORY': {
    const { userMemory } = await import('../memory/user.memory.js')
    UserService = userMemory
    break
  }
}

export const userService = new UserRepository(UserService)
