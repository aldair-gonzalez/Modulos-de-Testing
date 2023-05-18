import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  })
  const ticketPage = params.page ? params.page : 1
  const urlApiTickets = `${api}/api/tickets?page=${ticketPage}`

  const ticketsContainer = $('#tickets-container')
  const indexPages = $('#index-pages')

  fetch(urlApiTickets)
    .then(data => data.json())
    .then(data => {
      const { status, payload } = data
      if (status === 200) {
        const {
          docs,
          hasPrevPage,
          hasNextPage,
          prevPage,
          nextPage
        } = payload

        let cont = ''
        docs.forEach(doc => {
          cont += `
            <tr class="w-full fila" role="button" id="${doc._id}">
              <td class="py-4 px-6">${doc.purchaser.email}</td>
              <td class="py-4 px-6">${doc.code}</td>
              <td class="py-4 px-6">$${doc.amount}</td>
              <td class="py-4 px-6">${doc.purchase_datetime}</td>
            </tr>
          `
        })
        ticketsContainer.innerHTML = cont

        const buttonHasPrevPage = `
          <a href="/tickets?page=${prevPage}">
            <button class="bg-black w-40 py-2 transition-all ease-in-out duration-300 outline outline-2 -outline-offset-2 outline-neutral-500 hover:bg-neutral-800" type="submit">Anterior</button>
          </a>
        `
        const buttonHasNextPage = `
          <a href="/tickets?page=${nextPage}">
            <button class="bg-black w-40 py-2 transition-all ease-in-out duration-300 outline outline-2 -outline-offset-2 outline-neutral-500 hover:bg-neutral-800" type="submit">Siguiente</button>
          </a>
        `

        if (hasPrevPage) {
          indexPages.innerHTML = buttonHasPrevPage
        } else if (hasNextPage) {
          indexPages.innerHTML = buttonHasNextPage
        }
        if (hasPrevPage && hasNextPage) {
          indexPages.innerHTML = buttonHasPrevPage + buttonHasNextPage
        }
      }
    })
})()
