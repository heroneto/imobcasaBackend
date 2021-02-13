const Service = require('../Service')
const { UserRepository } = require('../../repositories')

class UserService extends Service {
  _requiredFields = ['fullName', 'username', 'email', 'password', 'admin', 'active']
  _updateRequiredFields = ['id']
  _deleteUserRequiredFields = ['id']
  _getUserRequiredFields = ['id']
  _changePasswordRequiredFields = ['password', 'newPassword', 'reqUserId', 'admin']

  constructor(){
    super()
    this._userRepository = new UserRepository()
  }

  
  async _checkPassword(user, password) {
    if (!await user.validPassword(password)) {
      this._throwUnalthorizedError("password")
    }
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

  async changePassword(fields){
    await this._checkRequiredFields(this._changePasswordRequiredFields, fields)
    const user = await this._userRepository.getOne({id: fields.reqUserId})
    await this._checkEntityExsits(user, "reqUserId")
    await this._checkPassword(user, fields.password)

    return fields
  }

}

module.exports = UserService