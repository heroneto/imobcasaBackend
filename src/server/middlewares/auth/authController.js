const {forbiden, invalidRequest, unauthorized, internalError} = require('../../controllers/config').protocols
const {invalidParamError, missingParamError, serverError} = require('../../controllers/config').errors
const User = require('../../models').users
const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '.env')})
const jwt = require('jsonwebtoken')

async function checkToken(token){
  try{
    const jwtDecoded = await jwt.verify(token, process.env.JWT_SECRET)
    const actualTime = new Date().getTime() / 1000
    if(actualTime > jwtDecoded.exp){
      console.log("Token expirado")
      return {...jwtDecoded,valid:false}
    }    
    return {...jwtDecoded,valid:true}
  }catch(err){
    return {valid:false,err}
  }
}

module.exports = {
  checkAuthentication: async (req,res,next)=>{
    try{    
      const {jwt} = req.signedCookies
      if(!jwt){
        const {error} = missingParamError('token')
        const {statusCode, body} = unauthorized(error)
        return res.status(statusCode).send(body)
      }
      const isAuthenticated = await checkToken(jwt)
      if(isAuthenticated.valid === false){
        const {error} = invalidParamError('token')
        const {statusCode, body} = unauthorized(error)
        return res.status(statusCode).send(body)
      }
      next()
    }catch(error){
      const {error:serverErrorMsg} = serverError()
      const {statusCode, body} = internalError(serverErrorMsg)
      return res.status(statusCode).send(body)
    }
  },
  userAuthentication: async (req,res,next) => {
    try{
      const {username, password} = req.body
      const requiredFields = ['username', 'password']
      for(const field of requiredFields){
        if(!req.body[`${field}`]){
          const {error} = missingParamError(field)
          const {statusCode, body} = invalidRequest(error)
          return res.status(statusCode).send(body)
        }
      }
      const user = await User.findOne({where: {username: username}})
      if(!user){
        const {error} = invalidParamError('username')
        const {statusCode, body} = unauthorized(error)
        return res.status(statusCode).send(body)
      }
      if(!await user.validPassword(password)){
        const {error} = invalidParamError('password')
        const {statusCode, body} = unauthorized(error)
        return res.status(statusCode).send(body)
      }
      const token = await user.generateToken(user.id, user.username)
      res.status(200)
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 8 * 3600000),
        secure: false,
        httpOnly: true,
        signed: true
      })
      return res.send({token:token, admin: user.admin, active: user.active})
    }catch(err){
      console.log(err)
      const {error:serverErrorMsg} = serverError()
      const {statusCode, body} = internalError(serverErrorMsg)
      return res.status(statusCode).send(body)
    }
  }
}