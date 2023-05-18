import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const pathArray = window.location.pathname.split('/')
  const resetPassValue = pathArray[pathArray.indexOf('reset-pass') + 1]

  const apiSession = `${api}/api/session`
  const form = $('#form-resetPassSuccess')

  form.addEventListener('submit', e => {
    e.preventDefault()

    const password = form.password.value

    fetch(`${apiSession}/reset-pass/${resetPassValue}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    })
      .then(data => data.json())
      .then(data => {
        if (data.status !== 200) {
          alert(data.error.message)
        } else {
          alert('Cambios guardados correctamente, por favor ingrese con su nueva contraseña')
          window.location.replace('/signin')
        }
      })
  })
})()
