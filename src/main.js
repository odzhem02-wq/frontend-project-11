import './style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { proxy } from 'valtio/vanilla';
import i18next from 'i18next';
import initView from './view.js';
import validateUrl from './validate.js';
import resources from './locales.js';
import { handleAddFeed, updateFeeds } from './controller.js';

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
      .then((validUrl) => handleAddFeed(validUrl, state))
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
    const button = e.target.closest('button');

    if (!button) {
      return;
    }

    const { id } = button.dataset;
    state.ui.modalPostId = id;

    if (!state.ui.viewedPosts.includes(id)) {
      state.ui.viewedPosts.push(id);
    }
  });

  updateFeeds(state);
});