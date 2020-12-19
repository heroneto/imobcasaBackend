const Service = require('./Service')
const {User} = require('../models')
const UserRepository = require ('../repositories/UserRepository')
const jwt = require('jsonwebtoken')

class AuthService extends Service {

  _authenticateRequiredFields = ["username", "password"]
  _checkAuthenticationRequiredFields = ["authorization"]
  _refreshTokenRequiredFields = ["refreshToken"]

  constructor() {
    super()
    this._userRepository = new UserRepository()
  }


  async _checkUserEntityExsits(entity) {
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

    await this._checkUserEntityExsits(user, "Username or Password")
    await this._checkActiveUser(user)
    await this._checkPassword(user, fields.password)

    const accessToken =  await user.generateToken(user.id, user.admin)
    const refreshToken =  await user.generateRefreshToken(user.id)
    return {
      accessToken, 
      refreshToken
    }
  }

  async checkAuthentication(fields) {
    
    await this._checkRequiredFields(this._checkAuthenticationRequiredFields, fields)
    const jwt = fields.authorization.split(" ")[1]
    await this._checkEntityExsits(jwt, "token")
    return await this._checkToken(jwt)
  }

  async refreshToken(fields){
    await this._checkRequiredFields(this._refreshTokenRequiredFields, fields)
    const refreshTokenDecoded = await this._checkToken(fields.refreshToken)
    const user = await this._userRepository.getOne({id: refreshTokenDecoded.id})

    return user.generateToken(user.id, user.admin)
  }
}

module.exports = AuthService