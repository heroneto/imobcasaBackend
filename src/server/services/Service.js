const ServiceException = require('../helpers/Exceptions/ServiceException')
const { forbiden, invalidRequest, unauthorized, internalError, noContent } = require('../helpers').protocols
const { invalidParamError, missingParamError, serverError, noResultsError } = require('../helpers').errors


class Service{

  _throwException(body,statusCode){
    throw new ServiceException(body, statusCode)
  }

  _checkRequiredFields(fieldsToCheck) {
    for (const field of fieldsToCheck) {
      if (!this.fields[`${field}`]) {
        const { statusCode, body } = this._getMissingParamError(field)
        this._throwException(body, statusCode)
      }
    }
  }

  _getMissingParamError(param){
    const { error } = missingParamError(param)
    const { statusCode, body } = invalidRequest(error)
    return { statusCode, body }
  }
}

module.exports = Service