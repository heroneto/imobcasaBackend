const {forbiden, invalidRequest, unauthorized, internalError} = require('../config').protocols
const {invalidParamError, missingParamError, serverError, missingBodyContent} = require('../config').errors
const Leads = require('../../models').lead

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
      
      const leadExists = await Leads.findOne({where: {
        phone: req.body.phone
      }})

      if(leadExists){
        return res.status(200).send({created:false, lead: leadExists})
      }
      const lead = await Leads.create(req.body)
      return res.status(200).send(lead)    
      
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
  },
  getAllLeads: async (req,res) => {
    try{
      const leads = await Leads.findAll()
      res.status(200).send({leads: leads})
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body)
    }
  },
  searchLeads: async (req,res) => {
    try{
      const { userid, phone, name } = req.body
      if(!userid && !phone && !name){
        const { error } = missingParamError('userid, phone and name')
        const { statusCode, body } = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      if(userid !== undefined && typeof(userid) === 'number'){
        const leads = await Leads.findAll({where: {userid: userid}})
        return res.status(200).send(leads)
      }
      if(phone !== undefined){
        const leads = await Leads.findAll({where: {phone}})
        return res.status(200).send(leads)
      }
      if(name !== undefined){
        const leads = await Leads.findAll({where: {name}})
        return res.status(200).send(leads)
      }
      
      const { error } = invalidParamError('userid, phone and name')
      const { statusCode, body } = invalidRequest(error)
      return res.status(statusCode).send(body)
    }catch(err){
      console.log(err)
      const {error} = serverError()
      const {statusCode, body} = internalError(error)
      return res.status(statusCode).send(body) 
    }
  }
}