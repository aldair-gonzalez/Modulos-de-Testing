import fs from 'fs'

import { response } from '../../utils/response.js'
import { productMemory } from '../memory/product.memory.js'
import { TicketM } from '../patterns/ticket.pattern.js'
import { Paginate } from '../patterns/paginate.pattern.js'

import { HandlerError, CodeError, InfoError } from '../../lib/error/index.error.js'

export class TicketMemory {
  constructor () {
    this.path = 'src/dao/db/tickets.json'
  }

  async getAll (page, limit) {
    try {
      page = parseInt(page)
      limit = parseInt(limit)
      const result = await this.getFile()
      const prev = page * limit - limit
      const hasPrevPage = page > 1
      const hasNextPage = JSON.parse(result).length > limit * page
      const pagingCounter = page
      const prevPage = page <= 1 ? null : page - 1
      const nextPage = JSON.parse(result).length > page * limit ? page + 1 : null
      const totalDocs = JSON.parse(result).length
      const totalPages = JSON.parse(result).length / limit < 1 && JSON.parse(result).length / limit !== 0 ? 1 : JSON.parse(result).length / limit
      return response(200, new Paginate(
        JSON.parse(result).splice(prev, limit),
        hasPrevPage,
        hasNextPage,
        limit,
        page,
        pagingCounter,
        prevPage,
        nextPage,
        totalDocs,
        totalPages
      ))
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async getOne (tid) {
    try {
      const result = await this.getFile()
      const exist = await JSON.parse(result).find(e => e._id === tid)
      if (!exist) return response(CodeError.NOT_FOUND, null, { code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Ticket not found' })
      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async create (obj) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const { user, products } = await obj
      const code = Math.random().toString(36).substring(0, 10)
      let ammount = 0
      for (const item of products) {
        const quantity = await item.quantity
        const price = await item.product.price
        ammount += await quantity * price
      }
      const infoProducts = await products.map(e => {
        return { _id: e.product._id, product: e.product.title, price: e.product.price, quantity: e.quantity }
      })

      let id = await clone.length + 1
      const existId = await clone.find(e => parseInt(e._id) === parseInt(id))
      if (existId) id = await id + 1

      const newTicket = new TicketM(code, ammount, user, infoProducts, id)

      for (const item of products) {
        const product = await productMemory.getOne(item.product._id)
        if (product.stock < item.quantity) return response(CodeError.BAD_REQUEST, null, { code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: `Product sold out of ${item.product.title} quantity ${item.quantity}` })
        product.stock = await product.stock - item.quantity
        await productMemory.udpate(product._id, product)
      }

      await clone.push(newTicket)
      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return response(201, newTicket)
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

export const ticketMemory = new TicketMemory()
