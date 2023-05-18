import { response } from '../../utils/response.js'
import { sendMail } from '../../utils/nodemailer.js'
import { cartModel } from '../models/cart.model.js'
import { productModel } from '../models/product.model.js'
import { ProductCart } from '../patterns/productCart.pattern.js'
import { Cart } from '../patterns/cart.pattern.js'
import config from '../../config/config.js'

import { HandlerError, CodeError, InfoError } from '../../lib/error/index.error.js'

class CartMongo {
  async getAll () {
    try {
      const result = await cartModel.find().populate(`${config.mongooseConfig.collections.products}.product`).lean()
      return response(200, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async getOne (cid) {
    try {
      if (!cid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid ID' })

      const result = await cartModel.findOne({ _id: cid }).populate(`${config.mongooseConfig.collections.products}.product`).lean()
      if (!result) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })
      return response(200, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async create () {
    try {
      const cart = new Cart()
      const result = await cartModel.create(cart)
      return response(201, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async update (cid, obj) {
    try {
      if (!cid) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Id are required' })
      if (!obj) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'All fields are required' })

      if (!cid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid ID' })

      const exist = await cartModel.findOne({ _id: cid })
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      const result = await cartModel.updateOne({ _id: cid }, obj)

      const { modifiedCount } = result
      if (!(modifiedCount > 0)) return response(202, null, { message: 'Not modified' })
      return response(200, obj)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async delete (cid) {
    try {
      if (!cid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid ID' })

      const exist = await cartModel.findById(cid)
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      const result = await cartModel.deleteOne({ _id: cid })
      const { deletedCount } = result
      if (!(deletedCount > 0)) return response(202, null, { message: 'Not deleted' })
      return response(200, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async purchase (cid, user, products) {
    try {
      if (!cid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid ID' })

      const exist = await cartModel.findById(cid)
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      exist.products = []
      const result = await cartModel.updateOne({ _id: cid }, exist)
      const { modifiedCount } = result
      if (!modifiedCount > 0) return response(202, null, { message: 'Not modified' })
      const handleProducts = []
      products.forEach(e => {
        const product = { product: e.product.title, price: e.product.price, code: e.product.code, quantity: e.quantity }
        handleProducts.push(product)
      })

      let ticket = ''
      let amount = 0
      handleProducts.forEach(e => {
        ticket += `
          <tr class="fila">
            <td style="
              padding: 1em 2em;
            "> ${e.code} </td>
            <td style="
              padding: 1em 2em;
            "> ${e.product} </td>
            <td style="
              padding: 1em 2em;
            "> $${e.price} </td>
            <td style="
              padding: 1em 2em;
            "> ${e.quantity} </td>
          </tr>
        `
        amount += e.price * e.quantity
      })
      const template = `
        <p>${user.fullname} gracias por tu compra.</p>
        <table>
          <thead>
            <tr>
              <th>code</th>
              <th>product</th>
              <th>price</th>
              <th>quantity</th>
            </tr>
          </thead>
          <tbody>
            ${ticket}
          </tbody>
        </table>
        <p>Total: $${amount}</p>
      `
      await sendMail(user, `${user.fullname} gracias por tu compra.`, template)

      return response(200, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async productAdd (cid, pid, user) {
    try {
      if (!cid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid cart ID' })
      if (!pid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid product ID' })

      const exist = await cartModel.findOne({ _id: cid }).populate(`${config.mongooseConfig.collections.products}.product`).lean()
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      const product = await productModel.findById(pid).lean()
      if (!product) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })

      const { _id, role } = user
      if (role === 'premium') {
        if (JSON.stringify(product.owner) === JSON.stringify(_id)) {
          HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'You cannot add your products to your cart' })
        }
      }

      const existProduct = exist.products.find(p => JSON.stringify(p.product._id) === JSON.stringify(pid))

      if (!existProduct) {
        const newProduct = new ProductCart(pid)
        const result = await cartModel.findByIdAndUpdate(cid, { $push: { products: newProduct } }).populate(`${config.mongooseConfig.collections.products}.product`).lean()
        return response(200, result)
      }

      existProduct.quantity = existProduct.quantity + 1
      const result = await cartModel.updateOne({ _id: cid }, exist)
      const { modifiedCount } = result
      if (!(modifiedCount > 0)) return response(202, null, { message: 'Not modified' })
      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async productUpdate (cid, pid, obj) {
    try {
      if (!cid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid cart ID' })
      if (!pid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid product ID' })

      const exist = await cartModel.findOne({ _id: cid }).populate(`${config.mongooseConfig.collections.products}.product`).lean()
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      const existProduct = exist.products.find(p => JSON.stringify(p.product._id) === JSON.stringify(pid))
      if (!existProduct) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })

      existProduct.quantity = obj.quantity

      const result = await cartModel.updateOne({ _id: cid }, exist).populate(`${config.mongooseConfig.collections.products}.product`).lean()
      const { modifiedCount } = result
      if (!(modifiedCount > 0)) return response(202, null, { message: 'Not modified' })
      return response(200, existProduct)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async productRemove (cid, pid) {
    try {
      if (!cid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid cart ID' })
      if (!pid.match(/^[0-9a-fA-F]{24}$/)) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Invalid product ID' })

      const exist = await cartModel.findOne({ _id: cid }).populate(`${config.mongooseConfig.collections.products}.product`).lean()
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      const existProduct = exist.products.find(p => JSON.stringify(p.product._id) === JSON.stringify(pid))
      if (!existProduct) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })

      const position = exist.products.findIndex(p => JSON.stringify(p.product._id) === JSON.stringify(pid))
      exist.products.splice(position, 1)

      const result = await cartModel.updateOne({ _id: cid }, exist)
      const { modifiedCount } = result
      if (!(modifiedCount > 0)) return response(202, null, { message: 'Not deleted' })
      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }
}

export const cartMongo = new CartMongo()
