'use strict'
const Boom = require('@hapi/boom')

function handleError(err, customMessage = null) {
  if (err.isBoom) {
    throw err
  } else if (
    !(err instanceof Error) &&
    typeof err === 'object' &&
    err.message
  ) {
    if (customMessage) {
      err.message = customMessage
    }
    const error = Boom.badRequest(err.message)
    error.output.payload.errorCode = err.code
    error.output.statusCode = err.status || 400
    error.reformat()
    throw error
  } else {
    console.error(err)
    throw Boom.badImplementation(err)
  }
}

const setCustomError = async (errorObj, type = null) => {
  let error;
  if (type !== null && type !== '' && type !== undefined) {
      if (type === 'login') {
          error = Boom.unauthorized('invalid password');
      }
  } else {
      error = Boom.badRequest('Invalid Credential');
  }
  error.output.payload.validation = {};
  error.output.payload.validation.errors = errorObj;
  handleError(error);
};

module.exports = {
  handleError,
  setCustomError
}
