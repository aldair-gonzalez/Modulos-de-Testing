import express from 'express'
import path from 'path'
import hbs from 'express-handlebars'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import compression from 'express-compression'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import { __dirname } from './dirname.js'
import { initPassport } from './config/passport.config.js'
import { addLogger } from './utils/logger.js'
import { isError } from './middlewares/error.js'
import { useMorgan } from './middlewares/morgan.js'

/* ------------------------------------------------------------------------------------------ */
/* ------------------------------------ Import Routes Api ----------------------------------- */
/* ------------------------------------------------------------------------------------------ */
import RoutesSession from './routes/session/session.routes.js'
import RoutesProduct from './routes/product/product.routes.js'
import RoutesCart from './routes/cart/cart.routes.js'
import RoutesTicket from './routes/ticket/ticket.routes.js'
import RoutesMocking from './routes/mocking/mocking.routes.js'
import RoutesUser from './routes/user/user.routes.js'

/* ------------------------------------------------------------------------------ */
/* ------------------------------- Routes Render -------------------------------- */
/* ------------------------------------------------------------------------------ */
import RoutesRenderSession from './routes/session/session.routes.views.js'
import RoutesRenderProduct from './routes/product/product.routes.views.js'
import RoutesRenderCart from './routes/cart/cart.routes.views.js'
import RoutesRenderTicket from './routes/ticket/ticket.routes.views.js'

const app = express()

initPassport()
app.use(passport.initialize())
app.use(cookieParser())
app.use(useMorgan)
app.use(addLogger)

app.use(compression({ brotli: { enabled: true, zlib: {} } }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(`${__dirname}/views`)))

app.engine('hbs', hbs.engine({ extname: 'hbs' }))
app.set('views', `${__dirname}/views`)
app.set('view engine', 'hbs')

/* ------------------------------------------------------------------------------------------ */
/* --------------------------------------- Routes Api --------------------------------------- */
/* ------------------------------------------------------------------------------------------ */
app.use('/api/session', RoutesSession)
app.use('/api/products', RoutesProduct)
app.use('/api/carts', RoutesCart)
app.use('/api/tickets', RoutesTicket)
app.use('/api/mocking', RoutesMocking)
app.use('/api/users', RoutesUser)

/* ------------------------------------------------------------------------------ */
/* -------------------------------- Routes Render ------------------------------- */
/* ------------------------------------------------------------------------------ */
app.use('/', RoutesRenderSession)
app.use('/products', RoutesRenderProduct)
app.use('/carts', RoutesRenderCart)
app.use('/tickets', RoutesRenderTicket)

const swaggerOptions = {
  definition: {
    openApi: '3.0.1',
    info: {
      title: 'Documentación de la Api',
      description: 'APIs que contiene nuestro proyecto'
    },
    components: {
      schemas: {}
    },
    example: {
      language: 'json'
    }
  },
  apis: [
    './src/docs/**/*.yaml',
    './src/docs/**/**/*.yaml'
  ]
}

const specs = swaggerJSDoc(swaggerOptions)

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.get('/loggerTest', (req, res) => {
  req.logger.debug('Test - DEBUG')
  req.logger.http('Test - HTTP')
  req.logger.info('Test - INFO')
  req.logger.warning('Test - WARNING')
  req.logger.error('Test - ERROR')
  req.logger.fatal('Test - FATAL')
  res.send({ status: 200, message: 'Logger test' })
})

app.get('/error', (req, res) => res.sendStatus(401))
app.get('/', (req, res) => res.redirect('/signin'))
app.get('*', (req, res) => res.sendStatus(404))

app.use(isError)

export default app
