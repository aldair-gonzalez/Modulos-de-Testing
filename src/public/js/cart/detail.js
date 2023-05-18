import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const idCart = window.location.pathname.split('/carts/').join('')
  const urlCart = `${api}/api/carts/${idCart}`
  const urlApiUser = `${api}/api/session/current`
  const urlApiTicket = `${api}/api/tickets`

  const listProductsContainer = $('#list-products-container')
  const paymentButton = $('#payment-button')

  let products
  fetch(urlCart)
    .then(data => data.json())
    .then(data => {
      const { payload } = data
      if (data.status !== 200) {
        alert(data.error.message)
      } else {
        if (payload.products.length > 0) {
          products = payload.products
          let content = ''
          payload.products.forEach((e, i) => {
            content += `
              <tr class="fila" role="button" id="${e.product._id}">
                <td class="py-4 px-6">${e.product.title}</td>
                <td class="py-4 px-6">${e.product.code}</td>
                <td class="py-4 px-6">$${e.product.price}</td>
                <td class="py-4 px-6">${e.product.category}</td>
                <td class="py-4 px-6">${e.quantity}</td>
              </tr>
            `
          })
          listProductsContainer.innerHTML = content
          paymentButton.style.display = 'flex'
        } else {
          paymentButton.style.display = 'none'
        }
      }
    })

  fetch(urlApiUser)
    .then(data => data.json())
    .then(data => {
      const { payload } = data
      if (data.status !== 200) {
        alert(data.error.message)
      } else {
        const { fullname, email } = payload
        const user = { fullname, email }

        paymentButton.addEventListener('click', () => {
          fetch(urlApiTicket, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, products })
          })
            .then(data => data.json())
            .then(data => {
              const { status } = data
              if (status === 201) {
                fetch(`${urlCart}/purchase`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ user, products })
                })
                  .then(data => data.json())
                  .then(data => {
                    const { status } = data
                    if (status === 200) {
                      alert('Success')
                      window.location.reload()
                    }
                  })
              }
            })
        })
      }
    })
})()
