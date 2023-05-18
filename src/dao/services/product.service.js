import config from '../../config/config.js'
import { connectMongo } from '../../utils/mongoose.js'
import { ProductRepository } from './repository/product.repository.js'

let ProductService

switch (config.store) {
  case 'MONGO': {
    connectMongo()
    const { productMongo } = await import('../mongo/product.mongo.js')
    ProductService = productMongo
    break
  }

  case 'MEMORY': {
    const { productMemory } = await import('../memory/product.memory.js')
    ProductService = productMemory
    break
  }
}

export const productService = new ProductRepository(ProductService)
