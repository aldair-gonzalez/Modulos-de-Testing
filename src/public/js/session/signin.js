import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const apiSession = `${api}/api/session`
  const form = $('#form-login')

  form.addEventListener('submit', e => {
    e.preventDefault()

    const user = {
      email: form.email.value,
      password: form.password.value
    }

    fetch(`${apiSession}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: user.email, password: user.password })
    })
      .then(data => data.json())
      .then(data => {
        if (data.status === 200) window.location = '/products'
        if (data.status !== 200) {
          const { error } = data
          alert(error.message)
        }
      })
  })
})()
