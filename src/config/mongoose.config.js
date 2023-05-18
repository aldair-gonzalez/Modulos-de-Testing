import { loadEnv } from './config.js'

loadEnv()

export default {
  url: process.env.MONGOOSE_URL,
  dbName: process.env.MONGOOSE_DB_NAME,
  collections: {
    users: process.env.MONGOOSE_DB_COLLECTION_USERS,
    products: process.env.MONGOOSE_DB_COLLECTION_PRODUCTS,
    carts: process.env.MONGOOSE_DB_COLLECTION_CARTS,
    tickets: process.env.MONGOOSE_DB_COLLECTION_TICKETS
  }
}
