import { Router } from 'express'

import { HandleSignIn, HandleSignUp, HandleCurrent, HandleLogout, HandleGithub, HandleUpdatePass, HandleCreateTokenResetPass } from '../../controllers/session/session.controllers.js'
import { requireApiSession } from '../../middlewares/session.js'
import { strategyPassport } from '../../utils/passport.js'

const router = Router()

router.get('/current',
  requireApiSession,
  strategyPassport('jwt'),
  HandleCurrent
)

router.get('/github',
  strategyPassport('github', { scope: ['user: email'] })
)

router.get('/github/callback',
  strategyPassport('github'),
  HandleGithub
)

router.post('/signin',
  strategyPassport('signin'),
  HandleSignIn
)

router.post('/signup',
  strategyPassport('signup'),
  HandleSignUp
)

router.post('/reset-pass', HandleCreateTokenResetPass)
router.post('/reset-pass/:token', HandleUpdatePass)

router.delete('/logout',
  requireApiSession,
  HandleLogout
)

export default router
