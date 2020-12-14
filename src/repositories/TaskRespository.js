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

  async update(){

  }

  async delete(){

  }

  async changeState(){

  }

  async disable(){
    
  }

}

module.exports = TaskRepository