import { ZodError } from 'zod'

interface FormatedError {
    messages: string[]
}

export const formatError = (errors: ZodError) => {
  const formatedError: FormatedError = {messages: []}
  errors.issues.forEach((element) => {
    formatedError.messages.push(element.message)
  })
  return formatedError
}
