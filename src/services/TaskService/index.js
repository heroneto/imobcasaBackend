const Service = require('../Service')
const {
  TaskRepository,
  LeadRepository,
  UserRepository,
  TaskTypeRepository,
} = require('../../repositories')

class TaskService extends Service {
  _createRequiredFields = ["title", "description", "userid", "leadid", "active", "startdate", "tasktypeid", "reqUserId", "admin"]
  _listByLeadRequiredFields = ["leadid", "reqUserId", "admin"]
  _getOneRequiredFields = ["id", "reqUserId", "admin"]
  _deleteRequiredFields = ["id", "reqUserId", "admin"]
  _updateRequiredFields = ["id", "title", "description", "userid", "leadid", "active", "startdate", "resolutionDate", "tasktypeid", "reqUserId", "admin"]

  constructor() {
    super()
    this._taskRepository = new TaskRepository()
    this._taskTypeRepository = new TaskTypeRepository()
    this._leadRepository = new LeadRepository()
    this._userRepository = new UserRepository()
  }

  async create(fields) {
    await this._checkRequiredFields(this._createRequiredFields, fields)
    const lead = await this._leadRepository.getOne({ id: fields.leadid })
    await this._checkEntityExsits(lead, "leadid")
    const user = await this._userRepository.getOne({ id: fields.userid })
    await this._checkEntityExsits(user, "userid")
    if (!fields.admin && fields.reqUserId !== fields.userid) {
      this._throwForbidenError()
    }
    const { reqUserId, admin, ...taskFields } = fields

    return await this._taskRepository.create(taskFields)
  }

  async listByLead(fields) {
    this._checkRequiredFields(this._listByLeadRequiredFields, fields)

    const lead = await this._leadRepository.getOne({ id: fields.leadid })
    this._checkEntityExsits(lead, "leadid")
    if (!fields.admin && lead.userid !== fields.reqUserId) {
      await this._throwForbidenError()
    }

    return await this._taskRepository.listByLead(fields)
  }

  async getOne(fields) {
    this._checkRequiredFields(this._getOneRequiredFields, fields)
    const task = await this._taskRepository.getOne(fields)
    this._checkEntityExsits(task)
    if (!fields.admin && task.userid !== fields.reqUserId) {
      this._throwForbidenError()
    }
    return task
  }

  async delete(fields) {
    this._checkRequiredFields(this._getOneRequiredFields, fields)
    const task = await this._taskRepository.getOne(fields)
    this._checkEntityExsits(task)
    if (!fields.admin && task.userid !== fields.reqUserId) {
      this._throwForbidenError()
    }
    return await this._taskRepository.delete(fields)
  }

  async update(fields) {
    await this._checkRequiredFields(this._updateRequiredFields, fields)
    const task = await this._taskRepository.getOne(fields)
    this._checkEntityExsits(task)
    const { reqUserId, admin, ...updateTaskFields } = fields
    if (!admin && reqUserId !== task.userid) {
      this._throwForbidenError()
    }
    const user = await this._userRepository.getOne({ id: fields.userid })
    await this._checkEntityExsits(user, "userid")
    const lead = await this._leadRepository.getOne({ id: fields.leadid })
    await this._checkEntityExsits(lead, "leadid")
    const taskType = await this._taskTypeRepository.getOne(fields.tasktypeid)
    await this._checkEntityExsits(taskType, "tasktypeid")

    return this._taskRepository.update(task, updateTaskFields)
  }

}

module.exports = TaskService