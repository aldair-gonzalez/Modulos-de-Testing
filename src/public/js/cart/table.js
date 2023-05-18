import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const urlCarts = `${api}/api/carts`

  const listCartContainer = $('#list-cart-container')

  fetch(urlCarts)
    .then(data => data.json())
    .then(data => {
      const { payload, status } = data
      if (status === 200) {
        let content = ''
        payload.forEach((e, i) => {
          content += `
            <tr class="fila">
              <td class="py-4 px-6">
                  <a class="bg-violet-500 text-white py-2 px-4 rounded-md font-medium" href="/carts/${payload[i]._id}">See Product Cart</a>
              </td>
              <td class="py-4 px-6">Cart: ${payload[i]._id} </td>
              <td class="py-4 px-6"> ${payload[i].products.length} </td>
            </tr>
          `
        })
        listCartContainer.innerHTML = content
      }
    })
})()
