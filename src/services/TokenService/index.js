const Service = require('../Service')
const { checkToken } = require('../apis')

class TokenService extends Service {
  _requiredFields = ["accessToken"]

  constructor() {
    super()
  }

  async setToken(fields) {
    this._checkRequiredFields(this._requiredFields, fields)
    const { accessToken } = fields
    const {data} = await checkToken(accessToken)
    console.log(data)
    return true
  }
}

module.exports = TokenService