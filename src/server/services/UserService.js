const User = require('../models').users
const Service = require('./Service')
const UserRepository = require('../repositories/UserRepository')

class UserService extends Service {
  _requiredFields = ['fullName', 'username', 'email', 'password', 'admin']
  _updateRequiredFields = ['id']
  _deleteUserRequiredFields = ['id']
  _getUserRequiredFields = ['id']


  constructor(){
    super()
    this._userRepository = new UserRepository()
  }

  

  async createUser(fields) {
    this.fields = fields
    await this._checkRequiredFields(this._requiredFields)
    return await this._userRepository.create(this.fields)
  }

  async findAll() {
    return await this._userRepository.findAll()
  }

  async updateUser(fields) {
    this.fields = fields
    await this._checkRequiredFields(this._updateRequiredFields)
    const user = await this._userRepository.getOne(this.fields)
    await this._checkEntityExsits(user)    
    return await this._userRepository.update(user, this.fields)
  }

  async deleteUser(fields) {
    this.fields = fields
    await this._checkRequiredFields(this._deleteUserRequiredFields)
    const user = await this._userRepository.getOne(this.fields)
    await this._checkEntityExsits(user)
    return await this._userRepository.delete(this.fields)
  }

  async getUser(fields) {
    this.fields = fields
    await this._checkRequiredFields(this._getUserRequiredFields)
    const user = await User.findOne({
      where: {
        id: this.fields.id
      }
    })
    await this._checkEntityExsits(user)
    return user
  }

}

module.exports = UserService