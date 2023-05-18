import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const idProduct = window.location.pathname.split('/products/').join('').split('/update').join('')

  const apiProduct = `${api}/api/products/${idProduct}`
  const formUpdateProduct = $('#form-update-product')

  fetch(apiProduct)
    .then(data => data.json())
    .then(data => {
      const { payload, status } = data
      if (status === 200) {
        formUpdateProduct.title.value = payload.title
        formUpdateProduct.description.value = payload.description
        formUpdateProduct.code.value = payload.code
        formUpdateProduct.price.value = payload.price
        formUpdateProduct.status.checked = payload.status
        formUpdateProduct.stock.value = payload.stock
        formUpdateProduct.category.value = payload.category
      }
    })

  formUpdateProduct.addEventListener('submit', e => {
    e.preventDefault()
    const product = {
      title: formUpdateProduct.title.value,
      description: formUpdateProduct.description.value,
      code: formUpdateProduct.code.value,
      price: formUpdateProduct.price.value,
      status: formUpdateProduct.status.checked,
      stock: formUpdateProduct.stock.value,
      category: formUpdateProduct.category.value
    }
    fetch(apiProduct, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
      .then(data => data.json())
      .then(data => {
        const { status } = data
        if (status === 200) {
          alert('Product updated successfully')
        }
      })
  })
})()
