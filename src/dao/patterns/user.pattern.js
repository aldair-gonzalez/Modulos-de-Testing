export class User {
  constructor (firstName, lastName, email, age, password, cart, role) {
    this.fullname = firstName + ' ' + lastName
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.age = age
    this.password = password
    this.cart = cart
    this.role = role
  }
}

export class UserM extends User {
  constructor (firstName, lastName, email, age, password, cart, role, id) {
    super(firstName, lastName, email, age, password, cart, role)
    this._id = id
  }
}
