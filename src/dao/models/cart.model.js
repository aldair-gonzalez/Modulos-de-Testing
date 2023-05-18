import { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import config from '../../config/config.js'

const collection = config.mongooseConfig.collections.carts
const schema = new Schema({
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: config.mongooseConfig.collections.products,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      _id: false
    }
  ]
})

schema.plugin(paginate)
export const cartModel = model(collection, schema)
