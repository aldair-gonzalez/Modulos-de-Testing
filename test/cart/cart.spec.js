import config from '../../src/config/config.js'
import chai from 'chai'
import mongoose from 'mongoose'

import { cartService } from '../../src/dao/services/cart.service.js'

const expect = chai.expect

describe('Cart Service', () => {
  before(async function () {
    await mongoose.connect(config.mongooseConfig.url, { dbName: 'ecommercetesting' })
    await mongoose.connection.collection(config.mongooseConfig.collections.carts).deleteMany({})
  })
  after(async function () {
    await mongoose.disconnect()
  })

  let cartId

  describe('getAll', () => {
    it('Debe devolver un array de carritos', async () => {
      try {
        const { status, payload } = await cartService.getAll()
        expect(status).to.be.equal(200)
        expect(payload).to.be.an('array')
      } catch (error) {
        chai.assert.fail(error.message)
      }
    })
  })

  describe('create', () => {
    it('Debe crear un nuevo carrito', async () => {
      try {
        const result = await cartService.create()

        const id = await result.payload._id
        cartId = id.toString()

        expect(result.status).to.be.equal(201)
        expect(result.payload).to.have.property('_id')
      } catch (error) {
        chai.assert.fail(error.message)
      }
    })
  })

  describe('getOne', () => {
    it('Debe devolver un carrito por ID', async () => {
      try {
        const result = await cartService.getOne(cartId)
        expect(result.status).to.be.equal(200)
        expect(result.payload).to.have.property('_id')
      } catch (error) {
        chai.assert.fail(error.message)
      }
    })
    it('Debe arrojar un error para un ID no válido', async () => {
      try {
        const invalidId = 'invalid_id'
        await cartService.getOne(invalidId)
        chai.assert.fail('Se esperaba que se lanzara un error')
      } catch (error) {
        expect(error).to.be.an('error')
        expect(error.message).to.include('Invalid ID')
      }
    })
  })
})
