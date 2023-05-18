import { Router } from 'express'
import { HandleChangeRolePremium, HandleChangeRoleUsuario } from '../../controllers/user/user.controller.js'

const router = Router()

router.post('/premium/:uid', HandleChangeRolePremium)
router.post('/usuario/:uid', HandleChangeRoleUsuario)

export default router
