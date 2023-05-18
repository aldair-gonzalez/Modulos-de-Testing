export class CartRepository {
  constructor (dao) {
    this.dao = dao
  }

  getAll () {
    const result = this.dao.getAll()
    return result
  }

  getOne (cid) {
    const result = this.dao.getOne(cid)
    return result
  }

  create () {
    const result = this.dao.create()
    return result
  }

  update (cid, obj) {
    const result = this.dao.update(cid, obj)
    return result
  }

  delete (cid) {
    const result = this.dao.delete(cid)
    return result
  }

  purchase (cid, user, obj) {
    const result = this.dao.purchase(cid, user, obj)
    return result
  }

  productAdd (cid, pid, user) {
    const result = this.dao.productAdd(cid, pid, user)
    return result
  }

  productUpdate (cid, pid, obj) {
    const result = this.dao.productUpdate(cid, pid, obj)
    return result
  }

  productRemove (cid, pid) {
    const result = this.dao.productRemove(cid, pid)
    return result
  }
}
