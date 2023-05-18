import fs from 'fs'

import { response } from '../../utils/response.js'
import { ProductM } from '../patterns/product.pattern.js'
import { Paginate } from '../patterns/paginate.pattern.js'

import { HandlerError, CodeError, InfoError } from '../../lib/error/index.error.js'

class ProductMemory {
  constructor () {
    this.path = 'src/dao/db/products.json'
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

  async getOne (pid) {
    try {
      const result = await this.getFile()
      const exist = await JSON.parse(result).find(e => parseInt(e._id) === parseInt(pid))
      if (!exist) return response(CodeError.NOT_FOUND, null, { code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })
      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async create (obj) {
    try {
      if (!obj.title) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Title is required' })
      if (!obj.code) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Code is required' })
      if (!obj.price) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Price is required' })
      if (!obj.stock) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Stock is required' })
      if (!obj.category) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Category is required' })

      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))
      let id = await clone.length + 1

      const exist = await clone.find(e => JSON.stringify(e.code) === JSON.stringify(obj.code))
      if (exist) HandlerError.createError({ code: CodeError.UNPROCESSABLE_ENTITY, cause: InfoError.UNPROCESSABLE_ENTITY, message: 'The product already exists' })
      const existId = await clone.find(e => parseInt(e._id) === parseInt(id))
      if (existId) id = await id + 1

      const product = new ProductM(obj.title, obj.description, obj.code, obj.price, obj.status, obj.stock, obj.category, obj.thumbnails, id)
      await clone.push(product)
      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return response(201, product)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async udpate (pid, obj) {
    try {
      if (!pid) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Id is required' })
      if (!obj) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'All fields are required' })

      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(pid))
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })

      exist.title = await obj.title || exist.title
      exist.description = await obj.description || exist.description
      exist.code = await obj.code || exist.code
      exist.price = await obj.price || exist.price
      exist.status = await obj.status || exist.status
      exist.stock = await obj.stock || exist.stock
      exist.category = await obj.category || exist.category
      exist.thumbnails = await obj.thumbnails || exist.thumbnails

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async delete (pid) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => parseInt(e._id) === parseInt(pid))
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'Product not found' })

      const position = await clone.indexOf(exist)
      await clone.splice(position, 1)

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

export const productMemory = new ProductMemory()
