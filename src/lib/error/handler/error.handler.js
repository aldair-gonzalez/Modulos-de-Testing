export class HandlerError {
  static createError ({ name = 'Error', code, cause, message }) {
    const error = new Error(message, { cause })
    error.name = name
    error.code = code
    throw error
  }
}
