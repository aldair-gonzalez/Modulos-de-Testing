import { ticketService } from '../../dao/services/ticket.service.js'

export const HandleGetAll = async (req, res, next) => {
  try {
    req.logger.debug('ticket controller: get all')
    const { page = 1, limit = 10 } = req.query
    const result = await ticketService.getAll(page, limit)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleGetOne = async (req, res, next) => {
  try {
    req.logger.debug('ticket controller: get one')
    const { tid } = req.params
    const result = await ticketService.getOne(tid)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
export const HandleCreate = async (req, res, next) => {
  try {
    req.logger.debug('ticket controller: create')
    const { user, products } = req.body
    const obj = { user, products }
    const result = await ticketService.create(obj)
    res.status(result.status).json(result)
  } catch (error) {
    next(error)
  }
}
