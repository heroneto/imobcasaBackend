const { invalidRequest } = require('../config/').protocols
const {  missingParamError } = require('../config/').errors

const Tasks = require('../../models').tasks




module.exports = {  
  createTask: async (req, res) => {
    try{
      const requiredFields = ['userid', 'leadid', 'statusid', 'tasktypeid', 'title']
      for(const field of requiredFields){
          if(!req.body[`${field}`]){
            const {error} = missingParamError(field)
            const {statusCode, body} = invalidRequest(error)
            return res.status(statusCode).send(body)
          }
      }
      return res.status(200).send('ok')
    }catch(err){
      const { statusCode, body } = internalError(err)
      return res.status(statusCode).send(body)
    }
  }
}


