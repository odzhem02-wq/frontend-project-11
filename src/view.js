import { subscribe } from 'valtio/vanilla';

const renderInput = (elements, state) => {
  if (state.form.error) {
    elements.input.classList.add('is-invalid');
  } else {
    elements.input.classList.remove('is-invalid');
  }
};

const renderFeedback = (elements, state) => {
  elements.feedback.textContent = state.form.error;

  if (state.form.error) {
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
  } else {
    elements.feedback.classList.remove('text-danger');
    elements.feedback.textContent = '';
  }
};

const renderForm = (elements, state) => {
  elements.submitButton.disabled = state.form.sending;
};

export default (state, elements) => {
  subscribe(state, () => {
    renderInput(elements, state);
    renderFeedback(elements, state);
    renderForm(elements, state);

    if (state.form.valid) {
      elements.form.reset();
      elements.input.focus();
      state.form.valid = false;
    }
  });
};