const User = require('../models').users
const { forbiden, invalidRequest, unauthorized, internalError, noContent } = require('../helpers').protocols
const { invalidParamError, missingParamError, serverError, noResultsError } = require('../helpers').errors
const { Op } = require("sequelize");
const ServiceException = require('../helpers/Exceptions/ServiceException')


class UserService {
  _requiredFields = ['fullName', 'username', 'email', 'password', 'admin']
  _updateRequiredFields = ['id']
  _deleteUserRequiredFields = ['id']
  _getUserRequiredFields = ['id']



  _checkRequiredFields(fieldsToCheck) {
    for (const field of fieldsToCheck) {
      if (!this.body[`${field}`]) {
        const { error } = missingParamError(field)
        const { statusCode, body } = invalidRequest(error)
        this._throwException(body, statusCode)
      }
    }
  }

  _throwException(body,statusCode){
    throw new ServiceException(body, statusCode)
  }



  async createUser(body) {
    this.body = body
    await this._checkRequiredFields(this._requiredFields)
    const user = await User.create(this.body)
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

  async updateUser(body) {
    this.body = body
    await this._checkRequiredFields(this._updateRequiredFields)

    const user = await User.findOne({
      where: {
        id: this.body.id
      }
    })
    if (!user) {
      const { error } = invalidParamError('id')
      const { statusCode, body } = invalidRequest(error)
      this._throwException(body,statusCode)
    }
    user.fullName = this.body.fullName
    user.username = this.body.username
    user.email = this.body.email
    user.admin = this.body.admin
    await user.save()
    return user
  }

  async deleteUser(body) {
    this.body = body
    await this._checkRequiredFields(this._deleteUserRequiredFields)
    const user = await User.findOne({
      where:
      {
        id: this.body.id
      }
    })
    if (!user) {
      const { error } = invalidParamError('id or username')
      const { statusCode, body } = invalidRequest(error)
      this._throwException(body,statusCode)
    }
    const result = await User.destroy({
      where:
      {
        id: this.body.id
      }
    })
    return result
  }

  async getUser(query) {
    this.body = query
    await this._checkRequiredFields(this._getUserRequiredFields)
    const user = await User.findOne({
      where: {
        id: this.body.id
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