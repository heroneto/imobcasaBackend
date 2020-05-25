const {forbiden, invalidRequest, unauthorized, internalError} = require('../protocols/httpCodes')
const {invalidParamError, missingParamError, serverError} = require('../Errors/')


module.exports = {
  searchUser: (req,res)=>{
    try{
      const {id, username, email} = req.body
      if(!email && !id && !username){
        const {error} = missingParamError('email, username or id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      res.status(200).send({user: ''})
    }catch(error){
      const {error:serverError} = serverError()
      const {statusCode, body} = internalError(serverError)
      return res.status(statusCode).send(body)
    }
}
}