const ServiceException = require('../helpers/Exceptions/ServiceException')
const { forbiden, invalidRequest, unauthorized, internalError, noContent } = require('../helpers').protocols
const { invalidParamError, missingParamError, serverError, noResultsError } = require('../helpers').errors


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

  _thorwUnalthorizedError(param){
    const {error} = invalidParamError(param)
    const {statusCode, body} = unauthorized(error)
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

}

module.exports = Service