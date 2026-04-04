import { subscribe } from 'valtio/vanilla';

const renderInput = (elements, state) => {
  if (state.form.error) {
    elements.input.classList.add('is-invalid');
  } else {
    elements.input.classList.remove('is-invalid');
  }
};

const renderFeedback = (elements, state, i18n) => {
  if (state.form.error) {
    elements.feedback.textContent = i18n.t(state.form.error);
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    return;
  }

  if (state.form.success) {
    elements.feedback.textContent = i18n.t('success.loaded');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    return;
  }

  elements.feedback.textContent = '';
  elements.feedback.classList.remove('text-danger', 'text-success');
};

const renderForm = (elements, state) => {
  elements.submitButton.disabled = state.form.sending;
};

const createFeedsMarkup = (feeds, i18n) => {
  if (feeds.length === 0) {
    return '';
  }

  const items = feeds.map((feed) => `
    <li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>
    </li>
  `).join('');

  return `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18n.t('sections.feeds')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${items}
      </ul>
    </div>
  `;
};

const createPostsMarkup = (posts, i18n) => {
  if (posts.length === 0) {
    return '';
  }

  const items = posts.map((post) => `
    <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
      <a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a>
    </li>
  `).join('');

  return `
    <div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18n.t('sections.posts')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
        ${items}
      </ul>
    </div>
  `;
};

const renderFeeds = (elements, state, i18n) => {
  elements.feeds.innerHTML = createFeedsMarkup(state.feeds, i18n);
};

const renderPosts = (elements, state, i18n) => {
  elements.posts.innerHTML = createPostsMarkup(state.posts, i18n);
};

export default (state, elements, i18n) => {
  subscribe(state, () => {
    renderInput(elements, state);
    renderFeedback(elements, state, i18n);
    renderForm(elements, state);
    renderFeeds(elements, state, i18n);
    renderPosts(elements, state, i18n);

    if (state.form.valid) {
      elements.form.reset();
      elements.input.focus();
      state.form.valid = false;
    }
  });
};