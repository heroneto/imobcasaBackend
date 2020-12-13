const Service = require('./Service')
const {User} = require('../models/')
const jwt = require('jsonwebtoken')

class AuthorizationService extends Service {

  _adminRequiredFields = ["jwt"]


  async _checkUserAdminPrivileges(id){
    const user = await User.findOne({ where: { id: id } })
    if (!user.admin) {
      this._throwForbidenError("jwt")      
    }
  }

  async checkUserAuthorization(fields) {
    const { jwt } = fields
    await this._checkRequiredFields(this._adminRequiredFields, fields)   
    const userDecoded = await this._checkToken(jwt)
    await this._checkUserAdminPrivileges(userDecoded.id)
    return userDecoded
  }
}

module.exports = AuthorizationService