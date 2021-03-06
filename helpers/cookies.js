export const DELETE = 'Thu, 16 Oct 1986 19:45:17 GMT'
export const SESSION = 0

// Set this to false to enable debug mode. This will
// disables the secure flag on cookies when set to false.

// NOTE: If secure is passed as `false` to the cookie
// function, this will be ignored.

// TODO: Don't use process.env.NODE_ENV so that this file
// can be ported to a separate library.
export let SECURE = process.env.NODE_ENV !== 'development'

// Set this to true if you want httpOnly set on cookies.
export let HTTP_ONLY = false

// Set this to change the default cookie path.
export let DEFAULT_PATH = '/'

export function objectToCookieString(object) {
  let result = ''
  for (const key of Object.keys(object)) {
    const value = object[key]
    if (typeof value === 'undefined') { continue }
    result += `${key}=${value};`
  }
  return result
}

export function cookieStringToObject(cookies) {
  const state = {}

  let current = {key: '', value: ''}
  let key = true

  for (const character of cookies) {
    if (key === true) {
      if (character === '=') key = false
      else current.key += character
      continue
    }

    // If this isn't the end of our value, continue contatenating it into
    // our current object.
    if (character !== ';') {
      current.value += character
      continue
    }

    // Trim keys and values to ensure extra spaces don't exist.
    current.key = current.key.trim()
    current.value = current.value.trim()

    // Update state with the cookie information after parsing it
    state[current.key] = decodeURIComponent(current.value)

    // Reset current now that the state object has been updated.
    current.key = current.value = ''

    // We're back to reading keys again.
    key = true
  }

  current.key = current.key.trim()
  current.value = current.value.trim()

  if (current.key) {
    state[decodeURIComponent(current.key)] = decodeURIComponent(current.value)
  }

  return state
}

export default function cookies(cookies, cookie, value, expiry, path, httpOnly, secure) {
  cookies = cookies || ''

  // Ensure that values are trimmed as one would expect
  cookies = cookies.trim()

  // Trim the specific cookie name if it is set
  if (cookie) cookie = cookie.trim()

  const state = cookieStringToObject(cookies)

  // If we don't have a cookie name then we are returning an object representing
  // the parsed cookie string as an object
  if (typeof cookie === 'undefined') { return state }

  // If we were given a name and no value, someone has requested the value of a
  // specific cookie - but that cookie wasn't found. So, we return undefined.
  if (typeof value === 'undefined') { return state[cookie] }

  // Encode the value so that we don't insert any dangerous characters
  value = encodeURIComponent(value)

  const expiryType = typeof expiry

  // If an expiry was given, add one.
  if (expiryType !== 'undefined') {
    if (expiryType !== 'string' && expiryType !== 'number') { expiry = expiry.toGMTString() }
    value += `; expires=${expiry}`
  }

  // If a path wasn't given, assume DEFAULT_PATH.
  if (typeof path === 'undefined') { path = DEFAULT_PATH }
  value += `; path=${path}`

  if (HTTP_ONLY || httpOnly) { value += '; HttpOnly' }

  if (SECURE && (typeof secure === 'undefined' || secure)) {
    value += '; secure'
  }

  // If the key hasn't been discovered yet, add it to our finals state.
  return `${encodeURIComponent(cookie)}=${value}`
}

// Pass cookies.DELETE as the expiration date to delete cookies
cookies.DELETE = DELETE

// Pass cookies.SESSION as the expiration date to delete cookies after the current session
cookies.SESSION = SESSION
