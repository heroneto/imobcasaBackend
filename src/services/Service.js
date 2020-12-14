const ServiceException = require('../helpers/Exceptions/ServiceException')
const { forbiden, invalidRequest, unauthorized, internalError, noContent, conflict } = require('../helpers').protocols
const { invalidParamError, missingParamError, serverError, noResultsError, forbidenError, conflictError } = require('../helpers').errors
const jwt = require('jsonwebtoken')

class Service{

  _throwException(body,statusCode){
    throw new ServiceException(body, statusCode)
  }

  _throwConflictError(param){
    const { error } = conflictError(param)
    const { statusCode, body } = conflict(error)
    this._throwException(body, statusCode)
  }

  _throwMissingParamError(param){
    const { error } = missingParamError(param)
    const { statusCode, body } = invalidRequest(error)
    this._throwException(body, statusCode)
  }

  _throwInvalidParamError(param){
    const { error } = invalidParamError(param)
    const { statusCode, body } = invalidRequest(error)
    this._throwException(body, statusCode)
  }

  _throwUnalthorizedError(param){
    const {error} = invalidParamError(param)
    const {statusCode, body} = unauthorized(error)
    this._throwException(body, statusCode)
  }

  _throwForbidenError(param = ""){
    const { error } = forbidenError(param)
    const { statusCode, body } = forbiden(error)
    this._throwException(body, statusCode)
  }

  _checkRequiredFields(requiredFields, fieldsToCheck) {
    const fieldsKeysToCheck = Object.keys(fieldsToCheck)
    for (const field of requiredFields) {
      if (!fieldsKeysToCheck.includes(field)) {
        this._throwMissingParamError(field)
      }
    }
  }  

  _checkEntityExsits(entity, param = "id"){
    if (!entity) {
      this._throwInvalidParamError(param)
    }
  }

  async _checkToken(token) {
    try {
      const jwtDecoded = await jwt.verify(token, process.env.JWT_SECRET)
      const actualTime = new Date().getTime() / 1000
      if (actualTime > jwtDecoded.exp) {
        this._throwUnalthorizedError("token")
      }
      return jwtDecoded
    } catch (err) {
      this._throwUnalthorizedError("token")
    }
  }
}

module.exports = Service