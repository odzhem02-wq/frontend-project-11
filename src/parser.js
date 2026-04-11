const parseRSS = (content) => {
  const parser = new DOMParser()
  const document = parser.parseFromString(content, 'application/xml')
  const parseError = document.querySelector('parsererror')

  if (parseError) {
    throw new Error('errors.invalidRss')
  }

  const channel = document.querySelector('channel')

  if (!channel) {
    throw new Error('errors.invalidRss')
  }

  const title = channel.querySelector('title')?.textContent
  const description = channel.querySelector('description')?.textContent
  const items = document.querySelectorAll('item')

  if (!title || !description || items.length === 0) {
    throw new Error('errors.invalidRss')
  }

  const posts = Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent ?? '',
    description: item.querySelector('description')?.textContent ?? '',
    link: item.querySelector('link')?.textContent ?? '',
  }))

  return {
    feed: {
      title,
      description,
    },
    posts,
  }
}

export default parseRSS
