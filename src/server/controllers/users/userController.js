const {forbiden, invalidRequest, unauthorized, internalError} = require('../config').protocols
const {invalidParamError, missingParamError, serverError} = require('../config').errors
const User = require('../../models').users
const { Op } = require("sequelize");


module.exports = {
  createUser: async (req,res)=>{
    try{
      const requiredFields = ['fullName', 'username', 'email', 'password', 'admin']
      for(const field of requiredFields){
        if(!req.body[`${field}`]){
          const {error} = missingParamError(field)
          const {statusCode, body} = invalidRequest(error)
          return res.status(statusCode).send(body)
        }
      }
      const user = await User.create(req.body)
      return res.status(200).json({user})
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
      const {id, fullName, username, email, admin} = req.body
      if(!id && !username){
        const {error} = missingParamError('id and username')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const user = await User.findOne({where:{
        [Op.or]:[
          {id: id},
          {username: username}
        ]}
      })
      if(!user){
        const {error} = invalidParamError('id or username')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }      
      user.fullName = fullName
      user.username = username
      user.email = email
      user.admin = admin
      await user.save()
      return res.status(200).send(user)
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  },
  deleteUser: async (req,res)=>{
    try{
      const {id, username} = req.body
      if(!id && !username){
        const {error} = missingParamError('id and username')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const user = await User.findOne({where:{
        [Op.or]:[
          {id: id},
          {username: username}
        ]}
      })
      if(!user){
        const {error} = invalidParamError('id or username')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      await User.destroy({where:{
        [Op.or]:[
          {id: id},
          {username: username}
        ]}
      })
      res.status(200).send({user})
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }  
  }
}