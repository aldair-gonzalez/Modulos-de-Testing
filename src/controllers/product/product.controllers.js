import { productService } from '../../dao/services/product.service.js'

export const HandleGetAll = async (req, res, next) => {
  try {
    req.logger.debug('product controller: get all')
    const { page = 1, limit = 10 } = req.query
    const result = await productService.getAll(page, limit)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleGetOne = async (req, res, next) => {
  try {
    req.logger.debug('product controller: get one')
    const { pid } = req.params
    const result = await productService.getOne(pid)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleCreate = async (req, res, next) => {
  try {
    req.logger.debug('product controller: create')
    const { owner } = req.query
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    const obj = { title, description, code, price, status, stock, category, thumbnails }
    const result = await productService.create(obj, owner)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleUpdate = async (req, res, next) => {
  try {
    req.logger.debug('product controller: update')
    const { pid } = req.params
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    const obj = { title, description, code, price, status, stock, category, thumbnails }
    const result = await productService.udpate(pid, obj)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleDelete = async (req, res, next) => {
  try {
    req.logger.debug('product controller: delete')
    const { pid } = req.params
    const { user } = req.body
    const result = await productService.delete(pid, user)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
