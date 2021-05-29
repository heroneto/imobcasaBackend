const { TaskType } = require('../../models')


class TaskTypeRepository {

  async getOne(id){
    return TaskType.findOne({
      where: {
        id: id
      }
    })
  }

  async list(){
    return TaskType.findAll()
  }
}

module.exports = TaskTypeRepository