import config from '../../src/config/config.js'
import chai from 'chai'
import mongoose from 'mongoose'

import { productService } from '../../src/dao/services/product.service.js'

const expect = chai.expect

describe('Product API', () => {
  before(async function () {
    await mongoose.connect(config.mongooseConfig.url, { dbName: 'ecommercetesting' })
    await mongoose.connection.collection(config.mongooseConfig.collections.products).deleteMany({})
  })

  after(async function () {
    await mongoose.disconnect()
  })

  describe('Product Service', () => {
    const productData = {
      title: 'Galletas',
      description: 'Galletas de miel',
      code: 'KHJFDSGV6',
      price: 20,
      status: true,
      stock: 34,
      category: 'resposteria'
    }
    let productId

    describe('getAll', () => {
      it('Debe devolver un array de productos', async () => {
        try {
          const { status, payload } = await productService.getAll()
          expect(status).to.be.equal(200)
          expect(payload.docs).to.be.an('array')
        } catch (error) {
          chai.assert.fail(error.message)
        }
      })
    })

    describe('create', () => {
      it('Debe crear un nuevo producto', async () => {
        try {
          const result = await productService.create(productData)

          const id = await result.payload._id
          productId = id.toString()

          expect(result.status).to.be.equal(201)
          expect(result.payload).to.have.property('_id')
        } catch (error) {
          chai.assert.fail(error.message)
        }
      })
      it('Debe arrojar un error por falta de campos obligatorios', async () => {
        try {
          await productService.create({})
          chai.assert.fail('Se esperaba que se lanzara un error')
        } catch (error) {
          expect(error).to.be.an('error')
          expect(error.message).to.include('are required')
        }
      })
      it('Debe arrojar un error si el producto ya existe', async () => {
        try {
          await productService.create(productData)
          chai.assert.fail('Se esperaba que se lanzara un error')
        } catch (error) {
          expect(error).to.be.an('error')
          expect(error.message).to.include('already exists')
        }
      })
    })

    describe('getOne', () => {
      it('Debe devolver un producto por ID', async () => {
        try {
          const result = await productService.getOne(productId)
          expect(result.status).to.be.equal(200)
          expect(result.payload.code).to.be.equal(productData.code)
        } catch (error) {
          chai.assert.fail(error.message)
        }
      })
      it('Debe arrojar un error para un ID no válido', async () => {
        try {
          const invalidId = 'invalid_id'
          await productService.getOne(invalidId)
          chai.assert.fail('Se esperaba que se lanzara un error')
        } catch (error) {
          expect(error).to.be.an('error')
          expect(error.message).to.include('Invalid ID')
        }
      })
    })

    describe('update', () => {
      it('Debe actualizar un producto', async () => {
        try {
          const updatedProductData = {
            title: 'Updated Product'
          }
          const result = await productService.udpate(productId, updatedProductData)
          expect(result.status).to.be.equal(200)
          expect(result.payload.title).to.be.equal(updatedProductData.title)
        } catch (error) {
          chai.assert.fail(error.message)
        }
      })
      it('Debe arrojar un error para un ID no válido', async () => {
        try {
          const invalidId = 'invalid_id'
          await productService.udpate(invalidId, {})
          chai.assert.fail('Se esperaba que se lanzara un error')
        } catch (error) {
          expect(error).to.be.an('error')
          expect(error.message).to.include('Invalid ID')
        }
      })
    })
  })
})
