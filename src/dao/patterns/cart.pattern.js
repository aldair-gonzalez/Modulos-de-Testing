export class Cart {
  constructor () {
    this.products = []
  }
}

export class CartM extends Cart {
  constructor (id) {
    super()
    this._id = id
  }
}
