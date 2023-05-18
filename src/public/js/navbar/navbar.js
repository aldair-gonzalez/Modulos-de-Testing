import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)
  const urlApiSession = `${api}/api/session/current`

  const user = $('#user')
  const containerLinks = $('#container-links')

  fetch(urlApiSession)
    .then(data => data.json())
    .then(data => {
      const { status, payload } = data
      if (status === 200) {
        const { fullname, cart, role } = payload
        user.innerText = fullname

        const isAdmin = `
          <li>
            <a href="/products">Productos</a>
          </li>
          <li>
            <a href="/products/create">Nuevo producto</a>
          </li>
          <li>
            <a href="/carts">Carritos</a>
          </li>
          <li>
            <a href="/tickets">Tickets de compra</a>
          </li>
        `

        const isPremium = `
          <li>
            <a href="/products">Productos</a>
          </li>
          <li>
            <a href="/products/create">Nuevo producto</a>
          </li>
          <li>
            <a href="/carts/${cart}" id="my-cart">Mi carrito</a>
          </li>
        `

        const isUser = `
          <li>
            <a href="/products">Productos</a>
          </li>
          <li>
            <a href="/carts/${cart}" id="my-cart">Mi carrito</a>
          </li>
        `

        if (role === 'admin') {
          containerLinks.innerHTML = isAdmin
        } else if (role === 'premium') {
          containerLinks.innerHTML = isPremium
        } else if (role === 'usuario') {
          containerLinks.innerHTML = isUser
        }
      }
    })
})()
