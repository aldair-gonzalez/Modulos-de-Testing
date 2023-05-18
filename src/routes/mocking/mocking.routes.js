import { Router } from 'express'
import { HandleGenerateProducts } from '../../controllers/mocking/mocking.controllers.js'
import { requireApiSession, requireAuthRoleAdmin } from '../../middlewares/session.js'

const router = Router()

router.get('/products', requireApiSession, requireAuthRoleAdmin, HandleGenerateProducts)

export default router
