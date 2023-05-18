import fs from 'fs'

import { response } from '../../utils/response.js'
import { UserM } from '../patterns/user.pattern.js'
import { createHash, isValidPassword } from '../../utils/hash.js'
import { cartMemory } from './cart.memory.js'
import { Paginate } from '../patterns/paginate.pattern.js'

import { HandlerError, CodeError, InfoError } from '../../lib/error/index.error.js'

class UserMemory {
  constructor () {
    this.path = 'src/dao/db/users.json'
  }

  async signin (email, password) {
    try {
      if (!email) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Email is required' })
      const result = await this.getFile()

      const exist = await JSON.parse(result).find(e => e.email === email)
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'User not found' })

      if (exist.password === null) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'This user does not have a password' })
      const valid = isValidPassword(exist, password)
      if (!valid) HandlerError.createError({ code: CodeError.UNPROCESSABLE_ENTITY, cause: InfoError.UNPROCESSABLE_ENTITY, message: 'Invalid password' })

      const user = {
        fullname: exist.fullname,
        first_name: exist.first_name,
        last_name: exist.last_name,
        email: exist.email,
        age: exist.age,
        cart: exist.cart,
        role: exist.role
      }

      return response(200, user)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
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

  async getOne (email) {
    try {
      const result = await this.getFile()
      const exist = await JSON.parse(result).find(e => e.email === email)
      if (!exist) return response(CodeError.NOT_FOUND, null, { code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'User not found' })
      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async create (obj) {
    try {
      if (!obj.email) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Email is required' })
      if (!obj.first_name) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'First name is required' })
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))
      let id = await clone.length + 1

      const exist = await clone.find(e => e.email === obj.email)
      if (exist) HandlerError.createError({ code: CodeError.UNPROCESSABLE_ENTITY, cause: InfoError.UNPROCESSABLE_ENTITY, message: 'User already exists' })
      const existId = await clone.find(e => parseInt(e._id) === parseInt(id))
      if (existId) id = await id + 1

      const cart = await cartMemory.create()
      const { payload } = cart
      let user
      if (obj.password) user = new UserM(obj.first_name, obj.last_name, obj.email, obj.age, createHash(obj.password), payload._id, 'usuario', id)
      else user = new UserM(obj.first_name, obj.last_name, obj.email, obj.age, null, payload._id, 'usuario', id)

      await clone.push(user)
      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return response(201, user)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async update (email, obj) {
    try {
      if (!email) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'Email is required' })
      if (!obj.obj) HandlerError.createError({ code: CodeError.BAD_REQUEST, cause: InfoError.BAD_REQUEST, message: 'All fields are required' })

      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => e.email === obj.email)
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'User not found' })

      exist.first_name = await obj.first_name || exist.first_name
      exist.last_name = await obj.last_name || exist.last_name
      exist.age = await obj.age || exist.age
      exist.password = await obj.password || exist.password
      exist.role = await obj.role || exist.role

      await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return response(200, exist)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async delete (email) {
    try {
      const readfile = await this.getFile()
      const clone = await structuredClone(JSON.parse(readfile))

      const exist = await clone.find(e => e.email === email)
      if (!exist) HandlerError.createError({ code: CodeError.NOT_FOUND, cause: InfoError.NOT_FOUND, message: 'User not found' })

      const positionUser = await clone.indexOf(exist)
      await clone.splice(positionUser, 1)

      const result = await fs.promises.writeFile(this.path, JSON.stringify(clone, null, '\t'))

      return response(200, result)
    } catch (error) {
      HandlerError.createError({ name: error.name, code: error.code, cause: error.cause, message: error.message })
    }
  }

  async ressetPass (email) {}

  async getFile () {
    const exist = fs.existsSync(this.path)
    if (!exist) await fs.promises.writeFile(this.path, JSON.stringify([]))
    const readfile = await fs.promises.readFile(this.path, 'utf-8')
    if (readfile === '') await fs.promises.writeFile(this.path, JSON.stringify([]))
    return readfile
  }
}

export const userMemory = new UserMemory()
