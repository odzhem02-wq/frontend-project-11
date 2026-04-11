import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.duplicate',
  },
  string: {
    url: 'errors.invalidUrl',
  },
})

export default (value, existingUrls) => {
  const schema = yup
    .string()
    .required()
    .url()
    .notOneOf(existingUrls)

  return schema.validate(value)
}