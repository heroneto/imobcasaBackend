const {forbiden, invalidRequest, unauthorized, internalError} = require('../Protocols/httpCodes')
const {invalidParamError, missingParamError, serverError} = require('../Errors/')


module.exports = {
  createLead: async (req,res) => {
    try{
      const {id} = req.body
      if(!id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      return res.status(200).send('ok')
    }catch(err){
      console.log(err)
    }
  }
}