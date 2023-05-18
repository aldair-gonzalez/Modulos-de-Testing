import { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import config from '../../config/config.js'

const collection = config.mongooseConfig.collections.products
const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  thumbnails: {
    type: [String],
    default: []
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: config.mongooseConfig.collections.users,
    default: 'admin'
  }
})

schema.plugin(paginate)
export const productModel = model(collection, schema)
