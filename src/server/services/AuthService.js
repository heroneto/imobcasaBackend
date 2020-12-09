const Service = require('./Service')
const User = require('../models').users
const jwt = require('jsonwebtoken')

class AuthService extends Service {

  _authenticateRequiredFields = ["username", "password"]
  _checkAuthenticationRequiredFields = ["jwt"]
  constructor() {
    super()
  }


  async _checkEntityExsits(entity) {
    if (!entity) {
      this._throwUnalthorizedError("Username or Password")
    }
  }

  async _checkPassword(user, password) {
    if (!await user.validPassword(password)) {
      this._throwUnalthorizedError("Username or Password")
    }
  }

  async _checkActiveUser(user) {
    if (!user.active) {
      this._throwUnalthorizedError("User is Not Active")
    }
  }

  async authenticate(fields) {
    await this._checkRequiredFields(this._authenticateRequiredFields, fields)
    const user = await User.findOne({
      where: {
        username: fields.username
      }
    })

    await this._checkEntityExsits(user)
    await this._checkActiveUser(user)
    await this._checkPassword(user, fields.password)

    return await user.generateToken(user.id, user.admin)
  }

  async checkAuthentication(fields) {
    const { jwt } = fields
    await this._checkRequiredFields(this._checkAuthenticationRequiredFields, fields)
    return await this._checkToken(jwt)
  }

}

module.exports = AuthService