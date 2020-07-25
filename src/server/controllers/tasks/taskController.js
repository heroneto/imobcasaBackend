const { invalidRequest, internalError } = require('../config/').protocols
const {  missingParamError, invalidParamError} = require('../config/').errors
const Tasks = require('../../models').task
const LeadStatus = require('../../models').leadstatus
const User = require('../../models').users
const Leads = require('../../models').lead
const Tasktype = require('../../models').tasktype
const TaskStatus = require('../../models').taskstatus



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
      const task = await Tasks.create(req.body)
      if(!task){
        throw new Error("error")
      }
      return res.status(200).send(task)
    }catch(err){
      if(err.name === 'SequelizeForeignKeyConstraintError'){ 
        const fields = err.fields
        const {error} = invalidParamError(fields)
        const { statusCode, body } = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const { statusCode, body } = internalError(err)
      return res.status(statusCode).send(body)
    }
  },
  getTask: async (req,res) => {
    try{
      const {id} = req.query
      if(!id){
        const {error} = missingParamError('id')
        const {statusCode, body} = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      return res.status(200).send('ok')
    }catch(err){
      const { statusCode, body } = internalError(err)
      return res.status(statusCode).send(body)
    }
  }
}


