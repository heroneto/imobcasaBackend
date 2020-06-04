const {forbiden, invalidRequest, unauthorized, internalError} = require('../protocols/httpCodes')
const {invalidParamError, missingParamError, serverError} = require('../Errors/')
const User = require('../models/').User


module.exports = {
  createUser: async (req,res)=>{
    try{
      const requiredFields = ['fullName', 'username', 'email', 'password', 'manager']
      for(const field of requiredFields){
        if(!req.body[`${field}`]){
          const {error} = missingParamError(field)
          const {statusCode, body} = invalidRequest(error)
          return res.status(statusCode).send(body)
        }
      }
      const user = await User.create(req.body)
      res.status(200).send({user})
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  },
  getAllUsers: async (req,res)=>{
    try{
      const users = await User.findAll()
      return res.status(200).json({users: users})
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  },
  updateUser: async (req,res)=>{
    try{
      const {id, fullName, username, email, manager} = req.body
      if(!id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const user = await User.findOne({where: {id: id}})
      if(!user){
        const {error} = invalidParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }      
      user.fullName = fullName
      user.username = username
      user.email = email
      user.manager = manager
      await user.save()
      res.status(200).send({user})
    }catch(err){
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  },
  deleteUser: async (req,res)=>{
    try{
      console.log(req.cookies)
      const {id} = req.body
      if(!id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const user = await User.findOne({where: {id: id}})
      if(!user){
        const {error} = invalidParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      await User.destroy({where: {id: id}})
      res.status(200).send({user})
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }  
  }
}