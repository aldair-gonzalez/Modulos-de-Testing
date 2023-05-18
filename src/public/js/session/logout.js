import { api } from '../utils/api.js'

(() => {
  const $ = (item) => document.querySelector(`${item}`)

  const apiSession = `${api}/api/session/logout`

  const form = $('#form-logout')

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault()

      fetch(apiSession, {
        method: 'DELETE'
      })
        .then(data => { if (data.status === 204) window.location = '/signin' })
    })
  }
})()
