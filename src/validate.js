import * as yup from 'yup';

export default (value, existingUrls) => {
  const schema = yup
    .string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(existingUrls, 'RSS уже добавлен');

  return schema.validate(value);
}; ы
