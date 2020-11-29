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
  async update(){
    
  }
  async delete(){
    
  }
  async getOne(){
    
  }

}

module.exports = UserRepository