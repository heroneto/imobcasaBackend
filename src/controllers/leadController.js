const {forbiden, invalidRequest, unauthorized, internalError} = require('../Protocols/httpCodes')
const {invalidParamError, missingParamError, serverError} = require('../Errors/')
const { Leads } = require('../models/')

module.exports = {
  getLead: async (req,res) => {
    try{
      const {id} = req.body
      if(!id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const lead = await Leads.findOne({
        where: {
          id: id
        }
      })
      
      if(!lead){
        const {error} = invalidParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      
      return res.status(200).send(lead)
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  }
}