export class ProductRepository {
  constructor (dao) {
    this.dao = dao
  }

  getAll (page, limit) {
    const result = this.dao.getAll(page, limit)
    return result
  }

  getOne (pid) {
    const result = this.dao.getOne(pid)
    return result
  }

  create (obj, owner) {
    const result = this.dao.create(obj, owner)
    return result
  }

  udpate (pid, obj) {
    const result = this.dao.udpate(pid, obj)
    return result
  }

  delete (pid, user) {
    const result = this.dao.delete(pid, user)
    return result
  }
}
