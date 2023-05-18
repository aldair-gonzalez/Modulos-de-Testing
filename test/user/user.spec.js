import config from '../../src/config/config.js'
import chai from 'chai'
import mongoose from 'mongoose'

import { userService } from '../../src/dao/services/user.service.js'

const expect = chai.expect

describe('User Service', () => {
  before(async function () {
    await mongoose.connect(config.mongooseConfig.url, { dbName: 'ecommercetesting' })
    await mongoose.connection.collection(config.mongooseConfig.collections.users).deleteMany({})
  })
  after(async function () {
    await mongoose.disconnect()
  })

  const userData = {
    firstName: 'XXXXXX',
    lastName: 'XXXXXX',
    email: 'XXXXXX',
    age: 18,
    password: 'XXXXXX'
  }

  describe('create', () => {
    it('Debe crear un nuevo usuario', async () => {
      try {
        const result = await userService.create(userData)
        expect(result.status).to.be.equal(201)
        expect(result.payload).to.have.property('_id')
      } catch (error) {
        chai.assert.fail(error.message)
      }
    })
    it('Debe arrojar un error por falta de campos obligatorios', async () => {
      try {
        await userService.create({})
        chai.assert.fail('Se esperaba que se lanzara un error')
      } catch (error) {
        expect(error).to.be.an('error')
        expect(error.message).to.include('are required')
      }
    })
    it('Debe arrojar un error si el usuario ya existe', async () => {
      try {
        await userService.create(userData)
        chai.assert.fail('Se esperaba que se lanzara un error')
      } catch (error) {
        expect(error).to.be.an('error')
        expect(error.message).to.include('already exists')
      }
    })
  })

  describe('update', () => {
    it('Debe actualizar un usuario', async () => {
      try {
        const updatedUserData = {
          firstName: 'ZZZZZZ'
        }
        const result = await userService.update(userData.email, updatedUserData)
        expect(result.status).to.be.equal(200)
        expect(result.payload.firstName).to.not.be.equal(userData.firstName)
        expect(result.payload.firstName).to.be.equal(updatedUserData.firstName)
      } catch (error) {
        chai.assert.fail(error.message)
      }
    })
  })

  describe('getOne', () => {
    it('Debe devolver un usuario por email', async () => {
      try {
        const result = await userService.getOne(userData.email)
        expect(result.status).to.be.equal(200)
        expect(result.payload).to.have.property('_id')
      } catch (error) {
        chai.assert.fail(error.message)
      }
    })
  })
})
