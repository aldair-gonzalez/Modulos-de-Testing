export class TicketRepository {
  constructor (dao) {
    this.dao = dao
  }

  async getAll (page, limit) {
    const result = await this.dao.getAll(page, limit)
    return result
  }

  async getOne (tid) {
    const result = await this.dao.getOne(tid)
    return result
  }

  async create (obj) {
    const result = await this.dao.create(obj)
    return result
  }
}
