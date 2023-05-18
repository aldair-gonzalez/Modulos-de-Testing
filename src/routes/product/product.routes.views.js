import { Router } from 'express'

import { HandleRenderCreateProduct, HandleRenderProductDetail, HandleRenderProducts, HandleRenderUpdateProduct } from '../../controllers/product/product.controllers.views.js'
import { requireAuthRoleAdminOrPremium, requireViewSession } from '../../middlewares/session.js'

const router = Router()

router.get('/', requireViewSession, HandleRenderProducts)
router.get('/create', requireViewSession, requireAuthRoleAdminOrPremium, HandleRenderCreateProduct)
router.get('/:pid', requireViewSession, HandleRenderProductDetail)
router.get('/:pid/update', requireViewSession, requireAuthRoleAdminOrPremium, HandleRenderUpdateProduct)

export default router
