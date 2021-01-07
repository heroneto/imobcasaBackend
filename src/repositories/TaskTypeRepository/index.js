const { TaskType } = require('../../models')


class TaskTypeRepository {

  async getOne(id){
    return TaskType.findOne({
      where: {
        id: id
      }
    })
  }
}

module.exports = TaskTypeRepository