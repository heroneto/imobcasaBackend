const { Task } = require('../models')


class TaskRepository {

  async create(fields){
    return await Task.create(fields)
  }

  async listByLead(fields){
    return await Task.findAll({
      where: {
        leadid: fields.leadid
      }
    })
  }

  async getOne(fields){    
    return await Task.findOne({
      where: {
        id: fields.id
      }
    })
  }

  async update(task, fields){
    task.title = fields.title
    task.description = fields.description
    task.userid = fields.userid
    task.leadid = fields.leadid
    task.active = fields.active
    task.startdate = fields.startdate
    task.tasktypeid = fields.tasktypeid
    return await task.save()
  }

  async delete(fields){
    return await Task.destroy({
      where: {
        id: fields.id
      }
    })
  }

  async changeState(){

  }

  async disable(){
    
  }

}

module.exports = TaskRepository