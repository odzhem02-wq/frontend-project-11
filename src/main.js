import './style.css';
import { proxy } from 'valtio/vanilla';
import i18next from 'i18next';
import initView from './view.js';
import validateUrl from './validate.js';
import resources from './locales.js';
import loadRss from './api.js';
import parseRSS from './parser.js';

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  submitButton: document.querySelector('button[type="submit"]'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  modal: {
    title: document.querySelector('.modal-title'),
    body: document.querySelector('.modal-body'),
    fullArticle: document.querySelector('.full-article'),
  },
};

const state = proxy({
  feeds: [],
  posts: [],
  ui: {
    viewedPosts: [],
    modalPostId: null,
  },
  form: {
    error: '',
    valid: false,
    sending: false,
    success: false,
  },
});

const i18nInstance = i18next.createInstance();

const createId = () => crypto.randomUUID();

const getNewPosts = (parsedPosts, existingPosts, feedId) => {
  const existingLinks = existingPosts
    .filter((post) => post.feedId === feedId)
    .map((post) => post.link);

  return parsedPosts
    .filter((post) => !existingLinks.includes(post.link))
    .map((post) => ({
      id: createId(),
      feedId,
      title: post.title,
      description: post.description,
      link: post.link,
    }));
};

const updateFeeds = () => {
  const promises = state.feeds.map((feed) => (
    loadRss(feed.url)
      .then((response) => {
        const { contents } = response.data;
        const parsedData = parseRSS(contents);
        const newPosts = getNewPosts(parsedData.posts, state.posts, feed.id);

        if (newPosts.length > 0) {
          state.posts.unshift(...newPosts);
        }
      })
      .catch(() => {
        // фоновые ошибки игнорируем
      })
  ));

  Promise.all(promises).finally(() => {
    setTimeout(updateFeeds, 5000);
  });
};

i18nInstance.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => {
  initView(state, elements, i18nInstance);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(elements.form);
    const url = formData.get('url').trim();
    const existingUrls = state.feeds.map((feed) => feed.url);

    state.form.sending = true;
    state.form.error = '';
    state.form.success = false;

    validateUrl(url, existingUrls)
      .then((validUrl) => loadRss(validUrl)
        .then((response) => {
          const { contents } = response.data;
          const parsedData = parseRSS(contents);

          const feedId = createId();

          const feed = {
            id: feedId,
            url: validUrl,
            title: parsedData.feed.title,
            description: parsedData.feed.description,
          };

          const posts = parsedData.posts.map((post) => ({
            id: createId(),
            feedId,
            title: post.title,
            description: post.description,
            link: post.link,
          }));

          state.feeds.unshift(feed);
          state.posts.unshift(...posts);
          state.form.valid = true;
          state.form.success = true;
          state.form.error = '';
        }))
      .catch((error) => {
        if (error.isAxiosError) {
          state.form.error = 'errors.network';
          return;
        }

        state.form.error = error.message;
      })
      .finally(() => {
        state.form.sending = false;
      });
  });

  elements.posts.addEventListener('click', (e) => {
    const button = e.target.closest('[data-id]');
    if (!button) {
      return;
    }

    const { id } = button.dataset;
    state.ui.modalPostId = id;

    if (!state.ui.viewedPosts.includes(id)) {
      state.ui.viewedPosts.push(id);
    }
  });

  updateFeeds();
});