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
    await this._checkRequiredFields(this._requiredFields, fields)
    return await this._userRepository.create(fields)
  }

  async findAll() {
    return await this._userRepository.findAll()
  }

  async updateUser(fields) {
    await this._checkRequiredFields(this._updateRequiredFields, fields)
    const user = await this._userRepository.getOne(fields)
    await this._checkEntityExsits(user)    
    return await this._userRepository.update(user, fields)
  }

  async deleteUser(fields) {
    await this._checkRequiredFields(this._deleteUserRequiredFields, fields)
    const user = await this._userRepository.getOne(fields)
    await this._checkEntityExsits(user)
    return await this._userRepository.delete(fields)
  }

  async getUser(fields) {
    await this._checkRequiredFields(this._getUserRequiredFields, fields)
    const user = await this._userRepository.getOne(fields)
    await this._checkEntityExsits(user)
    return user
  }

}

module.exports = UserService