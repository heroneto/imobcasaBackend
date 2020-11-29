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
    const { error } = invalidParamError('id')
    const { statusCode, body } = invalidRequest(error)
    this._throwException(body, statusCode)
  }


  _checkRequiredFields(fieldsToCheck) {
    for (const field of fieldsToCheck) {
      if (!this.fields[`${field}`]) {
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