import loadRss from './api.js'
import parseRSS from './parser.js'

const createId = () => String(Date.now() + Math.random())

const getNewPosts = (parsedPosts, existingPosts, feedId) => {
  const existingLinks = existingPosts
    .filter((post) => post.feedId === feedId)
    .map((post) => post.link)

  return parsedPosts
    .filter((post) => !existingLinks.includes(post.link))
    .map((post) => ({
      id: createId(),
      feedId,
      title: post.title,
      description: post.description,
      link: post.link,
    }))
}

export const handleAddFeed = (url, state) => (
  loadRss(url)
    .then((response) => {
      const { contents } = response.data
      const parsedData = parseRSS(contents)

      const feedId = createId()

      const feed = {
        id: feedId,
        url,
        title: parsedData.feed.title,
        description: parsedData.feed.description,
      }

      const posts = parsedData.posts.map((post) => ({
        id: createId(),
        feedId,
        title: post.title,
        description: post.description,
        link: post.link,
      }))

      state.feeds.unshift(feed)
      state.posts.unshift(...posts)
      state.form.valid = true
      state.form.success = true
      state.form.error = ''
    })
)

export const updateFeeds = (state) => {
  const promises = state.feeds.map((feed) => (
    loadRss(feed.url)
      .then((response) => {
        const { contents } = response.data
        const parsedData = parseRSS(contents)
        const newPosts = getNewPosts(parsedData.posts, state.posts, feed.id)

        if (newPosts.length > 0) {
          state.posts.unshift(...newPosts)
        }
      })
      .catch(() => {
      })
  ))

  Promise.all(promises).finally(() => {
    setTimeout(() => updateFeeds(state), 5000)
  })
}