const {Form} = require('../../models')


class FormRepository {

  async create (fields) {
    return await Form.create(fields)
  }
  async getOne(fields){
    return await Form.findOne({
      where: {
        id: fields.id
      }
    })
  }

  async list(){
    return await Form.findAll()
  }

  async inactivate(fields){
    return await Form.update({
      active: false
    }, {
      where: {
        id: fields.id
      }
    })    
  }
  async activate(fields){
    return await Form.update({
      active: true
    }, {
      where: {
        id: fields.id
      }
    })    
  }
  addUser = () => {

  }
  removeUser = () => {

  }

}

module.exports = FormRepository