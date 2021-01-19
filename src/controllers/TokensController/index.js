const { Router } = require('express')
const { internalError } = require('../../helpers/Protocols')
const { serverError } = require('../../helpers/Errors')
const ServiceException = require('../../helpers/Exceptions/ServiceException')
const AxiosException = require('../../helpers/Exceptions/AxiosException')
const { TokenService } = require('../../services')
const { AuthenticationMiddleware, AuthorizationMiddleware } = require('../../middlewares')


class TokensController {
  routes = Router()
  basePath = "/app/config/token"

  constructor(){
    this._authenticationMiddleware  = new AuthenticationMiddleware()
    this._authorizationMiddlware  = new AuthorizationMiddleware()
    this._load()    
  }

  async _load() {
    this.routes.route(this.basePath)
      .all(this._authenticationMiddleware.checkAuthentication)
      .all(this._authorizationMiddlware.checkAdminPrivileges)
      .post(this.setToken)
  }

  async setToken(request,response){
    try {
      const tokenService = new TokenService()
      const result = await tokenService.setToken(request.body)
      return response.status(200).json(result)
    } catch (err) {
      if(AxiosException(err)){
        const { status } = err.response
        const { message } = err.response.data.error
        return response.status(status).json(message)
      }
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }
  
  async getTokens(request, response){
    try {
      const tokenService = new TokenService()
      const result = await tokenService.getTokens()
      return response.status(200).json(result)
    } catch (err) {
      if(AxiosException(err)){
        const { status } = err.response
        const { message } = err.response.data.error
        return response.status(status).json(message)
      }
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }

  async updateToken(request, response){
    try {
      const tokenService = new TokenService()
      const result = await tokenService.updateToken(request.body)
      return response.status(200).json(result)
    } catch (err) {
      if(AxiosException(err)){
        const { status } = err.response
        const { message } = err.response.data.error
        return response.status(status).json(message)
      }
      if (err instanceof ServiceException) {
        const { statusCode, message } = err
        return response.status(statusCode).json(message)
      } else {
        console.error(err)
        const { error } = serverError()
        const { statusCode, body } = internalError(error)
        return response.status(statusCode).send(body)
      }
    }
  }
}

module.exports = TokensController