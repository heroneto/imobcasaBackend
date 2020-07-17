const {forbiden, invalidRequest, unauthorized, internalError} = require('../Protocols/httpCodes')
const {invalidParamError, missingParamError, serverError, missingBodyContent} = require('../Errors/')
const {Leads} = require('../models')

module.exports = {
  getLead: async (req,res) => {
    try{
      const {id} = req.query
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
  },
  createLead: async (req,res) => {
    try{
      const requiredFields = ['name', 'phone', 'source']
      for(const field of requiredFields){
        if(!req.body[`${field}`]){
          const {error} = missingParamError(field)
          const {statusCode, body} = invalidRequest(error)
          return res.status(statusCode).send(body)
        }
      }
      
      const [lead, created] = await Leads.findOrCreate({
        where: {
          phone: req.body.phone
        }
      })
      if(!created){
        await lead.update({...req.body})
      }      
      return res.status(200).send({lead, created})
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  },
  updateLead: async (req, res) => {
    try{
      if(!req.body){
        const {error} = missingBodyContent()
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      if(!req.body.id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const Lead = await Leads.findOne({where: { id: req.body.id}})
      if(!Lead || Lead === undefined){
        const {error} = invalidParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      Lead.update(req.body)
      return res.status(200).send(Lead)
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  },
  deleteLead: async (req, res) => {
    try{
      if(!req.query.id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      if(await Leads.destroy({where: {id: req.query.id}}) === 0){
        const {error} = invalidParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }      
      return res.status(200)
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  }
}