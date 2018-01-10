import fetch from 'isomorphic-fetch'
import store from 'store'

function url (...parts) {
  const root = store.getState().services.melody
  if (parts.length === 0) return root
  return root + parts.join('/') + '/'
}

function options (...parts) {
  const options = Object.assign({
    method: 'POST',
    credentials: 'same-origin',
    headers: [
      ['Accept', 'application/json'],
      ['Content-Type', 'application/json']
    ]
  }, ...parts)

  // Ensure JSON is parsed
  if (!options.body || typeof options.body === 'string') return options
  options.body = JSON.stringify(options.body)
  return options
}

function verify(response) {
  if (response.status < 200 || response.status > 299)
    throw new Error(
      'Received unexpected response from Melody services.'
    )

  return response
}

function request (...parts) {
  const urlParts = []
  const optionParts = []

  for (const part of parts) {
    if (typeof part === 'string') urlParts.push(part)
    else optionParts.push(part)
  }

  return new Promise((resolve, reject) => {
    fetch(url(...urlParts), options(...optionParts))
      .then(verify)
      .then(resolve)
      .catch(reject)
  })
}

export default {
  request,

  delete: request.bind(this, {method: 'DELETE'}),
  get: request.bind(this, {method: 'GET'}),
  head: request.bind(this, {method: 'HEAD'}),
  options: request.bind(this, {method: 'OPTIONS'}),
  post: request.bind(this, {method: 'POST'}),
  put: request.bind(this, {method: 'PUT'})
}