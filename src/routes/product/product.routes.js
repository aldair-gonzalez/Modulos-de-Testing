import { Router } from 'express'

import { HandleCreate, HandleDelete, HandleGetAll, HandleGetOne, HandleUpdate } from '../../controllers/product/product.controllers.js'
import { requireApiSession, requireAuthRoleAdminOrPremium } from '../../middlewares/session.js'

const router = Router()

router.get('/', requireApiSession, HandleGetAll)
router.post('/', requireApiSession, requireAuthRoleAdminOrPremium, HandleCreate)

router.get('/:pid', requireApiSession, HandleGetOne)
router.put('/:pid', requireApiSession, requireAuthRoleAdminOrPremium, HandleUpdate)
router.delete('/:pid', requireApiSession, requireAuthRoleAdminOrPremium, HandleDelete)

export default router
