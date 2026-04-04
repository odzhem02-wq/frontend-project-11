import './style.css';
import { proxy } from 'valtio/vanilla';
import initView from './view.js';
import validateUrl from './validate.js';

const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  submitButton: document.querySelector('button[type="submit"]'),
};

const state = proxy({
  feeds: [],
  form: {
    error: '',
    valid: false,
    sending: false,
  },
});

initView(state, elements);

elements.form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(elements.form);
  const url = formData.get('url').trim();
  const existingUrls = state.feeds.map((feed) => feed.url);

  state.form.sending = true;
  state.form.error = '';

  validateUrl(url, existingUrls)
    .then((validUrl) => {
      state.feeds.push({ url: validUrl });
      state.form.valid = true;
      state.form.error = '';
    })
    .catch((error) => {
      state.form.error = error.message;
    })
    .finally(() => {
      state.form.sending = false;
    });
});