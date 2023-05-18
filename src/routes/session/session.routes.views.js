import { Router } from 'express'
import { HandleRenderSignIn, HandleRenderSignUp, HandleRenderResetPass, HandleRenderResetPassSuccess } from '../../controllers/session/session.controllers.views.js'
import { requireExistSession } from '../../middlewares/session.js'

const router = Router()

router.get('/signin', requireExistSession, HandleRenderSignIn)
router.get('/signup', requireExistSession, HandleRenderSignUp)
router.get('/reset-pass', HandleRenderResetPass)
router.get('/reset-pass/:token', HandleRenderResetPassSuccess)

export default router
