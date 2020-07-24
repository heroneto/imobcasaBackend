const tasktype = require('../../models').tasktype
const { invalidParamError, missingParamError, missingBodyContent } = require('../config').errors
const { internalError, invalidRequest } = require('../config').protocols

module.exports = {
    createTask: (req,res) => {
        try{
            const requiredFields = ['name', 'description', 'active']
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