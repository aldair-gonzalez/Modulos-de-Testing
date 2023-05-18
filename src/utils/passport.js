import passport from 'passport'

export const strategyPassport = strategy => {
  return async (req, res, next) => {
    passport.authenticate(strategy, async (err, user, info) => {
      if (err) return next(err)
      if (!user) if (info !== undefined) return next(err)

      req.user = user
      next()
    })(req, res, next)
  }
}
