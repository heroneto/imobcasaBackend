const Service = require('../Service')


class TokenService extends Service {
  _requiredFields = ["accessToken"]

  constructor(){
    super()
  }

  async setToken(fields){
    this._checkRequiredFields(this._requiredFields, fields)
    return true
  }

}

module.exports = TokenService