import { Schema, model } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

import config from '../../config/config.js'

const collection = config.mongooseConfig.collections.users
const schema = new Schema({
  fullname: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    default: null
  },
  password: {
    type: String,
    default: null
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: config.mongooseConfig.collections.carts,
    default: null
  },
  role: {
    type: String,
    default: 'usuario',
    enum: ['usuario', 'admin', 'premium']
  }
})

schema.plugin(paginate)
export const userModel = model(collection, schema)
