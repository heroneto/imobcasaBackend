const {forbiden, invalidRequest, unauthorized, internalError} = require('../protocols/httpCodes')
const {invalidParamError, missingParamError, serverError} = require('../Errors/')
const User = require('../models/').User
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../../.env')})
const jwt = require('jsonwebtoken')

function generateToken(id, username){
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.DB_ENV === 'test' ? '1d' : '7d',
  });
  return token
}

function checkToken(token){
  if(token === 'validToken'){
    return true
  }else{
    return false
  }
}

module.exports = {
  checkAuthentication: (req,res,next)=>{
    try{
      const {token} = req.query
      if(!token){
        const {error} = missingParamError('token')
        const {statusCode, body} = unauthorized(error)
        return res.status(statusCode).send(body)
      }
      const isAuthenticated = checkToken(token)
      if(!isAuthenticated){
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
      const token = await generateToken(user.id, user.username)
      res.status(200)
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 10000),
        secure: false,
        httpOnly: true
      })
      res.header('Access-Control-Allow-Origin', 'http://localhost:3001')
      res.header('Access-Control-Allow-Credentials', true);
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

      return res.send('ok')
    }catch(err){
      console.log(err)
      const {error:serverErrorMsg} = serverError()
      const {statusCode, body} = internalError(serverErrorMsg)
      return res.status(statusCode).send(body)
    }
  }
}