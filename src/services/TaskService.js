const Service = require('./Service')
const TaskRespository = require('../repositories/TaskRespository')
const LeadRepository = require('../repositories/LeadRepository')
const UserRepository = require('../repositories/UserRepository')

class TaskService extends Service {
  _createRequiredFields = ["title", "description", "userid", "leadid", "active", "startdate", "tasktypeid", "reqUserId", "admin"]  
  _listByLeadRequiredFields = ["leadid", "reqUserId", "admin"]
  _getOneRequiredFields = ["id", "reqUserId", "admin"]
  constructor(){
    super()
    this._taskRepository = new TaskRespository()
    this._leadRepository = new LeadRepository()
    this._userRepository = new UserRepository()
  }

  async create(fields) {
    await this._checkRequiredFields(this._createRequiredFields, fields)
    const lead = await this._leadRepository.getOne({id: fields.leadid})
    await this._checkEntityExsits(lead, "leadid")
    const user = await this._userRepository.getOne({id: fields.userid})
    await this._checkEntityExsits(user, "userid")
    if(!fields.admin && fields.reqUserId !== fields.userid){
      this._throwForbidenError()
    }
    const { reqUserId, admin, ...taskFields } = fields

    return await this._taskRepository.create(taskFields)
  }

  async listByLead(fields) {
    this._checkRequiredFields(this._listByLeadRequiredFields, fields)
    
    const lead = await this._leadRepository.getOne({id: fields.leadid})
    this._checkEntityExsits(lead, "leadid")
    if(!fields.admin && lead.userid !== fields.reqUserId){
      await this._throwForbidenError()
    }
    
    return await this._taskRepository.listByLead(fields)
  }


  async getOne(fields) {
    this._checkEntityExsits(this._getOneRequiredFields, fields)


    return fields    
  }


  async delete() {

  }

  async update() {

  }


}

module.exports = TaskService