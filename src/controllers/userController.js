const {forbiden, invalidRequest, unauthorized, internalError} = require('../protocols/httpCodes')
const {invalidParamError, missingParamError, serverError} = require('../Errors/')



module.exports = {
  createUser: (req,res)=>{
    try{
      const requiredFields = ['fullName', 'username', 'email', 'password', 'passwordConfirmation', 'manager']
      for(const field of requiredFields){
        if(!req.body[`${field}`]){
          const {error} = missingParamError(field)
          const {statusCode, body} = invalidRequest(error)
          return res.status(statusCode).send(body)
        }
      }
      res.status(200).send({user: ''})
    }catch(error){
      const {error:serverError} = serverError()
      const {statusCode, body} = internalError(serverError)
      return res.status(statusCode).send(body)
    }
  },
  getAllUsers: (req,res)=>{
    try{
      res.status(200).send({users: ''})
    }catch(error){
      const {error:serverError} = serverError()
      const {statusCode, body} = internalError(serverError)
      return res.status(statusCode).send(body)
    }
  },
  updateUser: (req,res)=>{
    try{
      const {id, ...rest} = req.body
      if(!id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      if(id === "invalidUserId"){
        const {error} = invalidParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const user = {
        id,
        ...rest
      }    
      res.status(200).send({user})
    }catch(error){
      const {error:serverError} = serverError()
      const {statusCode, body} = internalError(serverError)
      return res.status(statusCode).send(body)
    }
  },
  deleteUser: (req,res)=>{
    try{
      const {id} = req.body
      if(!id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      if(id === "invalidUserId"){
        const {error} = invalidParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const user = {
        id
      }
      res.status(200).send({user})
    }catch(error){
      const {error:serverError} = serverError()
      const {statusCode, body} = internalError(serverError)
      return res.status(statusCode).send(body)
    }  
  }
}