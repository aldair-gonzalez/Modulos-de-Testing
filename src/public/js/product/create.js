import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const apiProducts = `${api}/api/products`
  const apiSession = `${api}/api/session/current`
  const form = $('#form-new-product')

  form.addEventListener('submit', e => {
    e.preventDefault()

    const product = {
      title: form.title.value,
      description: form.description.value,
      code: form.code.value,
      price: form.price.value,
      status: form.status.checked,
      stock: form.stock.value,
      category: form.category.value
    }

    fetch(apiSession)
      .then(data => data.json())
      .then(data => {
        if (data.status !== 200) {
          alert(data.error.message)
        } else {
          fetch(`${apiProducts}?owner=${data.payload._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
          })
            .then(data => data.json())
            .then(data => {
              if (data.status === 201) {
                form.reset()
                alert('Producto creado')
              }
              if (data.status === 422) {
                alert('El producto ya existe')
              }
            })
        }
      })
  })
})()
