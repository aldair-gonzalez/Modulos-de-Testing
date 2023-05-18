import { response } from '../../utils/response.js'
import { productModel } from '../models/product.model.js'
import { Product } from '../patterns/product.pattern.js'

import { HandlerError, CodeError, InfoError } from '../../lib/error/index.error.js'

class ProductMongo {
  async getAll (page, limit) {
    try {
      if (typeof page === 'undefined') page = 1
      if (typeof limit === 'undefined') limit = 10

      if (page < 1) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Page must be greater than 0' })
      if (limit < 1) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Limit must be greater than 0' })

      const result = await productModel.paginate({}, { page, limit, lean: true })
      return response(200, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async getOne (pid) {
    try {
      if (!pid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid ID' })

      const exist = await productModel.findById({ _id: pid }).lean()
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })
      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async create (obj, owner) {
    try {
      if (typeof obj !== 'object') HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid data' })

      if (!obj.title) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Title are required' })
      if (!obj.code) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Code are required' })
      if (!obj.price) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Price are required' })
      if (!obj.stock) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Stock are required' })
      if (!obj.category) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Category are required' })
      const exist = await productModel.findOne({ code: obj.code })
      if (exist) HandlerError.createError({ code: CodeError.UNPROCESSABLE_ENTITY, cause: InfoError.UNPROCESSABLE_ENTITY, message: 'The product already exists' })

      const product = new Product(obj.title, obj.description, obj.code, obj.price, obj.status, obj.stock, obj.category, obj.thumbnails, owner)
      const result = await productModel.create(product)

      return response(201, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async udpate (pid, obj) {
    try {
      if (!pid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid ID' })
      if (typeof obj !== 'object') HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid data' })

      if (!pid) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Id are required' })
      if (!obj) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'All fields are required' })

      const exist = await productModel.findById(pid)
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })

      exist.title = obj.title || exist.title
      exist.description = obj.description || exist.description
      exist.code = obj.code || exist.code
      exist.price = obj.price || exist.price
      exist.status = obj.status
      exist.stock = obj.stock || exist.stock
      exist.category = obj.category || exist.category
      exist.thumbnails = obj.thumbnails || exist.thumbnails

      const result = await productModel.updateOne({ _id: pid }, exist)
      const { modifiedCount } = result
      if (!(modifiedCount > 0)) return response(202, null, { message: 'Not modified' })
      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async delete (pid, user) {
    try {
      if (!pid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid ID' })

      const exist = await productModel.findById(pid)
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })

      const { _id, role } = user
      if (role === 'premium') if (exist.owner.toString() !== _id.toString()) HandlerError.createError({ code: CodeError.UNAUTHORIZED, cause: InfoError.UNAUTHORIZED, message: 'You are not authorized to delete this product' })

      const result = await productModel.deleteOne({ _id: pid })
      const { deletedCount } = result
      if (!(deletedCount > 0)) return response(202, null, { message: 'Not deleted' })
      return response(200, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }
}

export const productMongo = new ProductMongo()
