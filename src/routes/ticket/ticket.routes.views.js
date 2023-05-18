import { Router } from 'express'

import { HandleRenderTickets } from '../../controllers/ticket/ticket.controllers.views.js'
import { requireAuthRoleAdmin, requireViewSession } from '../../middlewares/session.js'

const router = Router()

router.get('/', requireViewSession, requireAuthRoleAdmin, HandleRenderTickets)

export default router
