const { internalError } = require('../../controllers/config').protocols
const { serverError } = require('../../controllers/config').errors

const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})
const AuthService = require('../../services/AuthService')
const ServiceException = require('../../helpers/Exceptions/ServiceException')

module.exports = {
  checkAuthentication: async (req,res,next)=>{
    try{         
      const authService = new AuthService()
      const tokenDecoded = await authService.checkAuthentication(req.signedCookies)
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
  },
  userAuthentication: async (req,res,next) => {
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