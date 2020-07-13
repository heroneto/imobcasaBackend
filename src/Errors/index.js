const {missingParamError} = require('./missing-param-errors')
const {invalidParamError} = require('./invalid-param-errors')
const {serverError} = require('./server-error')
const {noResultsError} = require('./no-result-errors')
const {missingBodyContent} = require('./missing-body-errors')

module.exports = {
  missingParamError,
  invalidParamError,
  serverError,
  noResultsError,
  missingBodyContent
}