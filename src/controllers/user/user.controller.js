import { userService } from '../../dao/services/user.service.js'

export const HandleChangeRolePremium = async (req, res, next) => {
  try {
    const { uid } = req.params
    const role = 'premium'
    const result = await userService.updateRole(uid, role)
    res.status(result.status).send(result)
  } catch (error) {
    next(error)
  }
}

export const HandleChangeRoleUsuario = async (req, res, next) => {
  try {
    const { uid } = req.params
    const role = 'usuario'
    const result = await userService.updateRole(uid, role)
    res.status(result.status).send(result)
  } catch (error) {
    next(error)
  }
}
