import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const apiSession = `${api}/api/session`
  const form = $('#form-resetPass')

  form.addEventListener('submit', e => {
    e.preventDefault()

    const email = form.email.value

    fetch(`${apiSession}/reset-pass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })
      .then(data => data.json())
      .then(data => {
        if (data.status !== 200) {
          alert(data.error.message)
        } else {
          alert('Email enviado con exito, revisa tu correo electronico para continuar con el proceso de recuperacion de contraseña')
          window.location.replace('/signin')
        }
      })
  })
})()
