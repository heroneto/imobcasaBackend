const User = require('../models').users
const { forbiden, invalidRequest, unauthorized, internalError, noContent } = require('../helpers').protocols
const { invalidParamError, missingParamError, serverError, noResultsError } = require('../helpers').errors
const Service = require('./Service')

class UserService extends Service {
  _requiredFields = ['fullName', 'username', 'email', 'password', 'admin']
  _updateRequiredFields = ['id']
  _deleteUserRequiredFields = ['id']
  _getUserRequiredFields = ['id']


  constructor(){
    super()
  }

  async _checkUserExsists(user){
    if (!user) {
      const { error } = invalidParamError('id or username')
      const { statusCode, body } = invalidRequest(error)
      this._throwException(body,statusCode)
    }
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
    if (!user) {
      const { error } = invalidParamError('id')
      const { statusCode, body } = invalidRequest(error)
      this._throwException(body,statusCode)
    }
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
    await this._checkUserExsists(user)

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
    if (!user) {
      const { error } = noResultsError('user')
      const { statusCode, body } = noContent(error)
      this._throwException(body,statusCode)
    }
    return user
  }

}

module.exports = UserService