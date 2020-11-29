const User = require('../models').users

class UserRepository {

  async create(fields){
    const user = await User.create(fields)
    return user
  }
  async findAll(){
    
  }
  async update(){
    
  }
  async delete(){
    
  }
  async getOne(){
    
  }

}

module.exports = UserRepository