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
    elements.feedback.classList.add('text-danger');
  } else {
    elements.feedback.textContent = '';
    elements.feedback.classList.remove('text-danger');
  }
};

const renderForm = (elements, state) => {
  elements.submitButton.disabled = state.form.sending;
};

export default (state, elements, i18n) => {
  subscribe(state, () => {
    renderInput(elements, state);
    renderFeedback(elements, state, i18n);
    renderForm(elements, state);

    if (state.form.valid) {
      elements.form.reset();
      elements.input.focus();
      state.form.valid = false;
    }
  });
};
