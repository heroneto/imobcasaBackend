const ServiceException = require('../helpers/Exceptions/ServiceException')
const { forbiden, invalidRequest, unauthorized, internalError, noContent } = require('../helpers').protocols
const { invalidParamError, missingParamError, serverError, noResultsError } = require('../helpers').errors
const jwt = require('jsonwebtoken')

class Service{

  _throwException(body,statusCode){
    throw new ServiceException(body, statusCode)
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

  _throwForbidenError(param){
    const { error } = invalidParamError(param)
    const { statusCode, body } = forbiden(error)
    this._throwException(body, statusCode)
  }

  _checkRequiredFields(requiredFields, fieldsToCheck) {
    for (const field of requiredFields) {
      if (!fieldsToCheck[`${field}`]) {
        this._throwMissingParamError(field)
      }
    }
  }  

  _checkEntityExsits(entity){
    if (!entity) {
      this._throwInvalidParamError('id')      
    }
  }

  async _checkToken(token) {
    try {
      const jwtDecoded = await jwt.verify(token, process.env.JWT_SECRET)
      const actualTime = new Date().getTime() / 1000
      if (actualTime > jwtDecoded.exp) {
        this._thorwUnalthorizedError("token")
      }
      return jwtDecoded
    } catch (err) {
      this._thorwUnalthorizedError("token")
    }
  }


}

module.exports = Service