const {forbiden, invalidRequest, unauthorized, internalError, noContent} = require('../config').protocols
const {invalidParamError, missingParamError, serverError, noResultsError} = require('../config').errors
const User = require('../../models').users
const { Op } = require("sequelize");
const UserService = require('../../services/UserService')


module.exports = {
  createUser: async (req,res)=>{
    try{
      const userService = new UserService()
      const user = await userService.createUser(req.body)
      delete user.password
      return res.status(200).json(user)
    }catch(err){
      console.error(err)
      const {statusCode, body} = JSON.parse(err.message)
      return res.status(statusCode).json(body)
    }
  },
  getAllUsers: async (req,res)=>{
    try{
      const userService = new UserService()
      const users = await userService.findAll()
      return res.status(200).json(users)
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  },
  updateUser: async (req,res)=>{
    try{
      const userService = new UserService()
      const user = await userService.updateUser(req.body)
     
      return res.status(200).json(user)
    }catch(err){
      console.error(err)
      const {statusCode, body} = JSON.parse(err.message)
      return res.status(statusCode).json(body)
    }
  },
  deleteUser: async (req,res)=>{
    try{
      const {id} = req.body
      if(!id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const user = await User.findOne({where:
        {
          id: id
        }
      })
      if(!user){
        const {error} = invalidParamError('id or username')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      await User.destroy({where:
        {
          id: id
        }
      })
      res.status(200).send({user})
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }  
  },
  getUser: async (req, res) => {
    try{
      const {id} = req.query
      if(!id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const user = await User.findOne({where: {id: id}})
      if(!user){
        const {error} = noResultsError('user')
        const {statusCode, body} = noContent(error)
        return res.status(statusCode).send(body)
      }
      return res.status(200).send(user)
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  }
}