import { Router } from 'express'

import { HandleCreate, HandleDelete, HandleGetAll, HandleGetOne, HandleProductAdd, HandleProductRemove, HandleProductUpdate, HandlePurchase, HandleUpdate } from '../../controllers/cart/cart.controllers.js'
import { requireApiSession, requireAuthRoleAdmin, requireAuthRoleUserOrPremium } from '../../middlewares/session.js'

const router = Router()

router.get('/', requireApiSession, requireAuthRoleAdmin, HandleGetAll)
router.post('/', requireApiSession, requireAuthRoleUserOrPremium, HandleCreate)

router.get('/:cid', requireApiSession, requireAuthRoleUserOrPremium, HandleGetOne)
router.put('/:cid', requireApiSession, requireAuthRoleUserOrPremium, HandleUpdate)
router.delete('/:cid', requireApiSession, requireAuthRoleUserOrPremium, HandleDelete)

router.post('/:cid/product/:pid', requireApiSession, requireAuthRoleUserOrPremium, HandleProductAdd)
router.put('/:cid/product/:pid', requireApiSession, requireAuthRoleUserOrPremium, HandleProductUpdate)
router.delete('/:cid/product/:pid', requireApiSession, requireAuthRoleUserOrPremium, HandleProductRemove)

router.post('/:cid/purchase', requireApiSession, requireAuthRoleUserOrPremium, HandlePurchase)

export default router
