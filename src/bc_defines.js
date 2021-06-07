export const ErrEnum = Object.freeze({
  errNone: 0,
  errInvalidFormat: -1,
  errTooShort: -2,
  errTooLong: -3,
  errInvalidChar: -4,
  errNoValidAddr: -5
})

export class PostcodeError extends Error {
  constructor (message, errCode) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PostcodeError)
    }

    this.name = 'PostcodeError';
    this.errCode = errCode
  }
}
