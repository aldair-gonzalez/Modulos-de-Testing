import { cartService } from '../../dao/services/cart.service.js'

export const HandleGetAll = async (req, res, next) => {
  try {
    req.logger.debug('cart controller: get all')
    const result = await cartService.getAll()
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleGetOne = async (req, res, next) => {
  try {
    const { cid } = req.params
    req.logger.debug('cart controller: get one')
    const result = await cartService.getOne(cid)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleCreate = async (req, res, next) => {
  try {
    req.logger.debug('cart controller: create')
    const result = await cartService.create()
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleUpdate = async (req, res, next) => {
  try {
    req.logger.debug('cart controller: update')
    const { cid } = req.params
    const result = await cartService.update(cid, req.body)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleDelete = async (req, res, next) => {
  try {
    req.logger.debug('cart controller: delete')
    const { cid } = req.params
    const result = await cartService.delete(cid)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}

export const HandlePurchase = async (req, res, next) => {
  try {
    req.logger.debug('cart controller: purchase')
    const { cid } = req.params
    const { user, products } = req.body
    const result = await cartService.purchase(cid, user, products)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}

export const HandleProductGet = async (req, res, next) => {
  try {
    req.logger.debug('cart controller: product get')
    const { cid, pid } = req.params
    const result = await cartService.productAdd(cid, pid)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}

export const HandleProductAdd = async (req, res, next) => {
  try {
    req.logger.debug('cart controller: product add')
    const { user } = req.body
    const { cid, pid } = req.params
    const result = await cartService.productAdd(cid, pid, user)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleProductUpdate = async (req, res, next) => {
  try {
    req.logger.debug('cart controller: product update')
    const { cid, pid } = req.params
    const result = await cartService.productUpdate(cid, pid, req.body)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleProductRemove = async (req, res, next) => {
  try {
    req.logger.debug('cart controller: product remove')
    const { cid, pid } = req.params
    const result = await cartService.productRemove(cid, pid)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
