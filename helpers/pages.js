import Promise from 'bluebird'

import { Metanic } from '~/clients/metanic'

import cookies from '~/helpers/cookies'

function initializeAuthorization({ req, store }) {
  const cookieData = cookies(req.headers.cookie)
  const token = cookieData['authentication:token']
  if (!token) { return }
  store.commit('updateAuthenticationToken', token)
}

function getInitalPageData(asyncData, context) {
  initializeAuthorization(context)

  const metanic = Metanic.FromStore(context.store)

  const user = metanic
    .get('user', 'current')
    .then(metanic.applyMeta(context))

  const promises = [user]

  if (asyncData) {
    promises.push(asyncData(context))
  }

  return Promise.all(promises).then((results) => {
    return Object.assign({}, ...results.slice(1))
  })
}

export default function createPage(page) {
  page.asyncData = getInitalPageData.bind(this, page.asyncData)
  return page
}
