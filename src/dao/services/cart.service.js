import config from '../../config/config.js'
import { connectMongo } from '../../utils/mongoose.js'
import { CartRepository } from './repository/cart.repository.js'

let CartService

switch (config.store) {
  case 'MONGO': {
    connectMongo()
    const { cartMongo } = await import('../mongo/cart.mongo.js')
    CartService = cartMongo
    break
  }

  case 'MEMORY': {
    const { cartMemory } = await import('../memory/cart.memory.js')
    CartService = cartMemory
    break
  }
}

export const cartService = new CartRepository(CartService)
