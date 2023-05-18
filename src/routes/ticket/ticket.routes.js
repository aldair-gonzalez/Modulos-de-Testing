import { Router } from 'express'

import { HandleCreate, HandleGetAll, HandleGetOne } from '../../controllers/ticket/ticket.controllers.js'
import { requireApiSession, requireAuthRoleAdmin, requireAuthRoleUserOrPremium } from '../../middlewares/session.js'

const router = Router()

router.get('/', requireApiSession, requireAuthRoleAdmin, HandleGetAll)
router.post('/', requireApiSession, requireAuthRoleUserOrPremium, HandleCreate)

router.get('/:tid', requireApiSession, HandleGetOne)

export default router
