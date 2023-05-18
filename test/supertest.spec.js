import mongoose from 'mongoose'
import chai from 'chai'
import supertest from 'supertest'

import config from '../src/config/config.js'

const expect = chai.expect
const request = supertest(`http://localhost:${config.serverPort}`)

describe('/api', () => {
  before(async function () {
    await mongoose.connect(config.mongooseConfig.url, { dbName: config.mongooseConfig.dbName })
    await mongoose.connection.collection(config.mongooseConfig.collections.users).deleteMany({})
    await mongoose.connection.collection(config.mongooseConfig.collections.carts).deleteMany({})
    await mongoose.connection.collection(config.mongooseConfig.collections.products).deleteMany({})
  })
  after(async function () {
    await mongoose.disconnect()
  })
  const userMock = {
    firstName: 'User',
    lastName: 'Admin',
    email: 'admin@gmail.com',
    age: 18,
    password: '123',
    role: 'admin'
  }
  const productMock = {
    title: 'Galletas',
    description: 'Galletas de miel',
    code: 'KHJFDSGV6',
    price: 20,
    status: true,
    stock: 34,
    category: 'resposteria'
  }
  let cookieSession
  let productId

  describe('/session', () => {
    describe('POST => /signup', () => {
      it('Debe registrar un nuevo usuario y devolver un token JWT', async () => {
        const { headers } = await request.post('/api/session/signup')
          .send(userMock)

        const split = await headers['set-cookie'][0].split('=').join(';').split(';')
        cookieSession = {
          name: split[0],
          token: split[1]
        }

        expect(cookieSession.name).to.be.ok.and.equal('jwt')
        expect(cookieSession.token).to.be.ok.and.be.a('string')
      })
    })

    describe('POST => /signin', () => {
      it('Debe iniciar sesión en el usuario y devolver un token JWT', async () => {
        const { headers } = await request.post('/api/session/signin')
          .send({ email: userMock.email, password: userMock.password })

        const split = await headers['set-cookie'][0].split('=').join(';').split(';')
        cookieSession = {
          name: split[0],
          token: split[1]
        }

        expect(cookieSession.name).to.be.ok.and.equal('jwt')
        expect(cookieSession.token).to.be.ok.and.be.a('string')
      })
    })
  })

  describe('/products', () => {
    describe('GET => /', () => {
      it('Debe devolver un listado de productos', async () => {
        const { _body } = await request.get('/api/products')
          .set('Cookie', [`${cookieSession.name}=${cookieSession.token}`])

        expect(_body.status).to.be.ok.and.equal(200)
        expect(_body.payload).to.haveOwnProperty('docs')
        expect(_body.payload.docs).to.be.an('array')
      })
      it('Debe redireccionar al path /error si no se proporciona un token JWT', async () => {
        const { headers } = await request.get('/api/products')

        expect(headers.location).to.be.ok.and.equal('/error')
      })
    })

    describe('POST => /', () => {
      it('Debe crear un nuevo producto', async () => {
        const { _body } = await request.post('/api/products')
          .set('Cookie', [`${cookieSession.name}=${cookieSession.token}`])
          .send(productMock)

        productId = await _body.payload._id
        expect(_body.status).to.be.ok.and.equal(201)
        expect(_body.payload).to.haveOwnProperty('code')
        expect(_body.payload.code).to.be.ok.and.equal(productMock.code)
      })
      it('Debe redireccionar al path /error si no se proporciona un token JWT', async () => {
        const { headers } = await request.post('/api/products')

        expect(headers.location).to.be.ok.and.equal('/error')
      })
    })

    describe('GET => /:pid', () => {
      it('Debe devolver un producto por su ID', async () => {
        const { _body } = await request.get(`/api/products/${productId}`)
          .set('Cookie', [`${cookieSession.name}=${cookieSession.token}`])

        // console.log(_body)
        expect(_body.status).to.be.ok.and.equal(200)
        expect(_body.payload).to.haveOwnProperty('code')
        expect(_body.payload.code).to.be.ok.and.equal(productMock.code)
      })
      it('Debe devolver un error 400 si no se proprociona un ID no válido', async () => {
        const invalidId = 'invalid_id'
        const { _body } = await request.get(`/api/products/${invalidId}`)
          .set('Cookie', [`${cookieSession.name}=${cookieSession.token}`])

        expect(_body.status).to.be.ok.and.equal(400)
        expect(_body.payload).to.equal(null)
        expect(_body).to.haveOwnProperty('error')
      })
      it('Debe redireccionar al path /error si no se proporciona un token JWT', async () => {
        const { headers } = await request.get(`/api/products/${productId}`)

        expect(headers.location).to.be.ok.and.equal('/error')
      })
    })

    describe('PUT => /:pid', () => {
      it('Debe actualizar un producto por su ID', async () => {
        const { _body } = await request.put(`/api/products/${productId}`)
          .set('Cookie', [`${cookieSession.name}=${cookieSession.token}`])
          .send({
            title: 'Galletas de chocolate',
            description: 'Galletas de chocolate',
            code: 'KHJFDSGV6',
            price: 20,
            status: false,
            stock: 34,
            category: 'resposteria'
          })

        expect(_body.status).to.be.ok.and.equal(200)
        expect(_body.payload).to.haveOwnProperty('code')
        expect(_body.payload.code).to.be.ok.and.equal('KHJFDSGV6')
      })
      it('Debe devolver un error 400 si no se proprociona un ID no válido', async () => {
        const invalidId = 'invalid_id'
        const { _body } = await request.put(`/api/products/${invalidId}`)
          .set('Cookie', [`${cookieSession.name}=${cookieSession.token}`])
          .send({})

        expect(_body.status).to.be.ok.and.equal(400)
        expect(_body.payload).to.equal(null)
        expect(_body).to.haveOwnProperty('error')
      })
    })
  })
})
