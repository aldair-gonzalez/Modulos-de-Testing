import { Router } from 'express'
import { HandleRenderCartDetail, HandleRenderCarts } from '../../controllers/cart/cart.controllers.views.js'
import { requireAuthRoleAdmin, requireAuthRoleUserOrPremium, requireViewSession } from '../../middlewares/session.js'

const router = Router()

router.get('/', requireViewSession, requireAuthRoleAdmin, HandleRenderCarts)
router.get('/:cid', requireViewSession, requireAuthRoleUserOrPremium, HandleRenderCartDetail)

export default router
