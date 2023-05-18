import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  })
  const page = params.page ? params.page : 1
  const urlApiUser = `${api}/api/session/current`
  const urlApiProducts = `${api}/api/products?page=${page}`
  const urlApiGenerateProducts = `${api}/api/mocking/products`

  const productsContainer = $('#products-container')
  const indexPages = $('#index-pages')
  const buttonGenerateProducts = $('#button-generate-products')

  fetch(urlApiProducts)
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

        const renderProducts = () => {
          let cont = ''
          docs.forEach(doc => {
            cont += `
              <tr class="w-full fila" role="button" id="${doc._id}">
                <td class="py-4 px-6">${doc.title}</td>
                <td class="py-4 px-6">${doc.code}</td>
                <td class="py-4 px-6">$${doc.price}</td>
                <td class="py-4 px-6">${doc.status}</td>
                <td class="py-4 px-6">${doc.category}</td>
              </tr>
            `
          })
          productsContainer.innerHTML = cont
          handleLinks()
        }
        const handleLinks = () => {
          const filas = document.querySelectorAll('.fila')

          filas.forEach((f, i) => {
            filas[i].addEventListener('click', (e) => {
              const id = e.target.parentElement.id
              window.location.href = `/products/${id}`
            })
          })
        }

        renderProducts()

        fetch(urlApiUser)
          .then(data => data.json())
          .then(data => {
            const { payload } = data
            if (payload.role === 'admin') {
              buttonGenerateProducts.style.display = 'block'
              buttonGenerateProducts.addEventListener('click', () => {
                buttonGenerateProducts.style.pointerEvents = 'none'
                buttonGenerateProducts.style.opacity = 0.8
                buttonGenerateProducts.innerText = 'Espera Cargando...'

                fetch(urlApiGenerateProducts)
                  .then(data => data.json())
                  .then(data => {
                    window.location.reload()
                    buttonGenerateProducts.style.pointerEvents = 'auto'
                    buttonGenerateProducts.innerText = 'Generar Productos'
                  })
              })
            } else {
              buttonGenerateProducts.style.display = 'none'
            }
          })

        const buttonHasPrevPage = `
          <a href="/products?page=${prevPage}">
            <button class="bg-black w-40 py-2 transition-all ease-in-out duration-300 outline outline-2 -outline-offset-2 outline-neutral-500 hover:bg-neutral-800" type="submit">Anterior</button>
          </a>
        `
        const buttonHasNextPage = `
          <a href="/products?page=${nextPage}">
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
