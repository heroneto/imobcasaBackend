const User = require('../models').users

class UserRepository {

  async create(fields){
    const user = await User.create(fields)
    return user
  }
  
  async findAll(){
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    })
    return users
  }

  async update(user, fields){   
    user.fullName = fields.fullName
    user.username = fields.username
    user.email = fields.email
    user.admin = fields.admin
    await user.save()
    return user
  }

  async delete(fields){
    const result = await User.destroy({
      where:
      {
        id:fields.id
      }
    })
    return result
  }

  async getOne(fields){
    const user = await User.findOne({
      where: {
        id: fields.id
      }
    })
    return user
  }
}

module.exports = UserRepository