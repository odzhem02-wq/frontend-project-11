import axios from 'axios'

const buildProxyUrl = url => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get')
  proxyUrl.searchParams.set('disableCache', 'true')
  proxyUrl.searchParams.set('url', url)
  return proxyUrl.toString()
}

export default url => axios.get(buildProxyUrl(url))
