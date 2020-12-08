const { internalError } = require('../../controllers/config').protocols
const { serverError } = require('../../controllers/config').errors
const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})
const AuthhorizationService = require('../../services/AuthorizationService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')

class AuthorizationMiddleware {

  async checkAdminPrivileges (req, res, next){
    try{
      const authorizationService = new AuthhorizationService()
      const jwtDecoded = await authorizationService.checkUserAuthorization(req.signedCookies)
      next()
    }catch(err){
      if(err instanceof ServiceException){
        const {statusCode, message} = err
        return res.status(statusCode).json(message)
      }else {
        console.error(err)
        const {error} = serverError()
        const {statusCode, body} = internalError(error)
        return res.status(statusCode).send(body)
      }
    }
  }
}

module.exports = AuthorizationMiddleware