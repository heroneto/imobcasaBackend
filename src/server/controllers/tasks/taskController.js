const { invalidParamError } = require('../config/Errors')

const { invalidRequest } = require('../config/').protocols
const {  missingParamError } = require('../config/').errors
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
      const tasktype = await Tasktype.findOne({where:{id: tasktypeid}})
      if(!tasktype){
        const {error} = invalidParamError('tasktypeid')
        const { statusCode, body } = invalidRequest(error)
        return res.status(statusCode).send(body)
      }
      return res.status(200).send('ok')
    }catch(err){
      const { statusCode, body } = internalError(err)
      return res.status(statusCode).send(body)
    }
  }
}


