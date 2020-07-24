const { invalidRequest, internalError } = require('../config/').protocols
const {  missingParamError, invalidParamError} = require('../config/').errors
const Tasks = require('../../models').tasks
const LeadStatus = require('../../models').leadstatuses
const User = require('../../models').User
const Leads = require('../../models').Leads
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
      const {userid, leadid, statusid, tasktypeid, title} = req.body
      const task = await Tasks.create({userid, leadid, statusid, tasktypeid, title})
      console.log(task)
      return res.status(200).send('ok')
    }catch(err){
      if(err.name === 'SequelizeForeignKeyConstraintError'){ 
        const fields = err.fields
        const {error} = invalidParamError(fields)
        console.log(error)
        const { statusCode, body } = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      const { statusCode, body } = internalError(err)
      return res.status(statusCode).send(body)
    }
  }
}


