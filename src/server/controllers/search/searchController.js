const {forbiden, invalidRequest, unauthorized, internalError, successfulRequest} = require('../config').protocols
const {invalidParamError, missingParamError, serverError, noResultsError} = require('../config').errors
const User = require('../../models').users

module.exports = {
  searchUser: async (req,res)=>{
    try{
      const {id, username, email} = req.body
      if(!email && !id && !username){
        const {error} = missingParamError('email, username or id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const users = await User.findAll({where: {id: id}}) || await User.findAll({where: {username: username}})  || await User.findAll({where: {email: email}})
      if(users.length == 0){
        const {error} = noResultsError('no users found')
        const {statusCode, body} = successfulRequest(error)
        return res.status(statusCode).send(body)
      }
      res.status(200).send({users})
    }catch(err){
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
}
}