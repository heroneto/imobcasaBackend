const { Router } = require('express')
const { internalError } = require('../config').protocols
const { serverError } = require('../config').errors
const AuthService = require('../../services/AuthService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')


class AuthenticationController {
  routes = Router()
  basePath = "/login"

  constructor() {
    this._load()
  }


  async _load() {
    this.routes.post(this.basePath, this.authenticate)    
  }

  async authenticate(req, res){
    try{
      const authService = new AuthService()
      const token = await authService.authenticate(req.body)
      res.status(200)
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 8 * 3600000),
        secure: false,
        httpOnly: true,
        signed: true
      })
      return res.json(token)
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

module.exports = AuthenticationController