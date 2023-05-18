export class Ticket {
  constructor (code, amount, purchaser, products) {
    this.code = code
    this.purchase_datetime = new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0].replace('T', ' ')
    this.amount = amount
    this.purchaser = purchaser
    this.products = products
  }
}

export class TicketM extends Ticket {
  constructor (code, amount, purchaser, products, id) {
    super(code, amount, purchaser, products)
    this._id = id
  }
}
