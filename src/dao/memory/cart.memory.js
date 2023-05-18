import fs from 'fs'

import { response } from '../../utils/response.js'
import { ProductCart } from '../patterns/productCart.pattern.js'
import { CartM } from '../patterns/cart.pattern.js'
import { productMemory } from './product.memory.js'

import { sendMail } from '../../utils/nodemailer.js'

import { HandlerError, CodeError, InfoError } from '../../lib/error/index.error.js'

class CartMemory {
  constructor () {
    this.path = 'src/dao/db/carts.json'
  }

  async getAll () {
    try {
      const result = await this.getFile()
      return response(200, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async getOne (cid) {
    try {
      const result = await this.getFile()
      const exist = await JSON.parse(result).find(element => parseInt(element._id) === parseInt(cid))
      if (!exist) return response(CodeError.NOT_FOUND, null, { code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      for (let i = 0; i < exist.products.length; i++) {
        const product = await productMemory.getOne(exist.products[i].product)
        exist.products[i].product = product.payload
      }
      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async create () {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))
      const id = await clone.length + 1

      const cart = new CartM(id)
      await clone.push(cart)
      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))
      return response(201, cart)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async update (cid, obj) {
    try {
      if (!cid) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Id is required' })
      if (!obj) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'All fields are required' })

      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(cid))
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      exist.products = await obj.products || exist.products

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async delete (cid) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(cid))
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      const position = await clone.indexOf(exist)
      await clone.splice(position, 1)

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return response(200, { deletedCount: 1 })
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async purchase (cid, user, products) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(cid))
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      exist.products = []

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

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))
      return response(200, { modifiedCount: 1 })
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async productAdd (cid, pid) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(cid))
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      let existProduct = await exist.products.find(p => parseInt(p.product) === parseInt(pid))

      if (existProduct) {
        existProduct.quantity = await existProduct.quantity + 1
      } else {
        existProduct = new ProductCart(parseInt(pid))
        await exist.products.push(existProduct)
      }

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))
      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async productUpdate (cid, pid, obj) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(cid))
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      const existProduct = await exist.products.find(p => parseInt(p.product) === parseInt(pid))
      if (!existProduct) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })

      existProduct.quantity = await obj.quantity

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))
      return response(200, existProduct)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async productRemove (cid, pid) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(cid))
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Cart not found' })

      const existProduct = await exist.products.find(p => parseInt(p.product) === parseInt(pid))
      if (!existProduct) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })

      const position = await exist.products.findIndex(p => parseInt(p.product) === parseInt(pid))
      await exist.products.splice(position, 1)

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))
      return response(200, { deletedCount: 1 })
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async getFile () {
    const exist = fs.existsSync(this.path)
    if (!exist) await fs.promises.writeFile(this.path, JSON.stringify([]))
    const readfile = await fs.promises.readFile(this.path, 'utf-8')
    if (readfile === '') await fs.promises.writeFile(this.path, JSON.stringify([]))
    return readfile
  }
}

export const cartMemory = new CartMemory()
