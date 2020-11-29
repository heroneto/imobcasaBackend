const User = require('../models').users
const Service = require('./Service')

class UserService extends Service {
  _requiredFields = ['fullName', 'username', 'email', 'password', 'admin']
  _updateRequiredFields = ['id']
  _deleteUserRequiredFields = ['id']
  _getUserRequiredFields = ['id']


  constructor(){
    super()
  }

  

  async createUser(fields) {
    this.fields = fields
    await this._checkRequiredFields(this._requiredFields)
    const user = await User.create(this.fields)
    return user
  }

  async findAll() {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    })
    return users
  }

  async updateUser(fields) {
    this.fields = fields
    await this._checkRequiredFields(this._updateRequiredFields)

    const user = await User.findOne({
      where: {
        id: this.fields.id
      }
    })
    await this._checkEntityExsits(user)
    user.fullName = this.fields.fullName
    user.username = this.fields.username
    user.email = this.fields.email
    user.admin = this.fields.admin
    await user.save()
    return user
  }

  async deleteUser(fields) {
    this.fields = fields
    await this._checkRequiredFields(this._deleteUserRequiredFields)
    const user = await User.findOne({
      where:
      {
        id:this.fields.id
      }
    })
    await this._checkEntityExsits(user)

    const result = await User.destroy({
      where:
      {
        id:this.fields.id
      }
    })
    return result
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