export class Product {
  constructor (title, description, code, price, status, stock, category, thumbnails, owner) {
    this.title = title
    this.description = description
    this.code = code
    this.price = price
    this.status = status
    this.stock = stock
    this.category = category
    this.thumbnails = thumbnails
    this.owner = owner
  }
}

export class ProductM extends Product {
  constructor (title, description, code, price, status, stock, category, thumbnails, owner, id) {
    super(title, description, code, price, status, stock, category, thumbnails, owner)
    this._id = id
  }
}
